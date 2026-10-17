---
title: "Livewire Form Objects, and Where Component State Should Live"
description: How to use Livewire form objects for create and edit screens, validation with rules(), uploads and resets, plus when state belongs in the URL, the session, a computed property or a locked property.
tags:
  - Livewire
  - Laravel
  - Forms
  - TALL Stack
image: /images/blog/livewire-form-objects/cover.jpg
banner: /images/blog/livewire-form-objects/cover.jpg
createdAt: 2025-04-30T10:00:00.000Z
updatedAt: 2026-10-17T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

## Livewire Form Objects, and Where Component State Should Live

A Livewire component with a form grows in a predictable way. First it has six public
properties, then a `rules()` method, then an edit mode that fills those properties from a model,
then a second component that needs the same fields. By then the component is mostly form, and the
part that is actually about the page is hard to find.

[Form objects](https://livewire.laravel.com/docs/forms) move the fields, their rules and the
save logic into one class. The component keeps one property that holds the form. This post covers
how to structure them for create and edit screens, the validation details that trip people up, and
then a broader question that form objects force you to answer: which state belongs on the form,
and which belongs somewhere else.

### The basic shape

Generate the class with Artisan:

```bash
php artisan livewire:form PostForm
```

That creates `app/Livewire/Forms/PostForm.php`. A form object extends `Livewire\Form` and its
public properties behave like component properties:

```php
namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use Livewire\Form;

class PostForm extends Form
{
    #[Validate('required|min:5')]
    public string $title = '';

    #[Validate('required|min:20')]
    public string $content = '';
}
```

The component declares it as a typed property, and Livewire instantiates it for you:

```php
namespace App\Livewire;

use App\Livewire\Forms\PostForm;
use App\Models\Post;
use Livewire\Component;

class CreatePost extends Component
{
    public PostForm $form;

    public function save()
    {
        $this->validate();

        Post::create($this->form->all());

        return $this->redirect('/posts');
    }
}
```

In Blade you bind with a dot path, and error keys use the same path:

```blade
<form wire:submit="save">
    <input type="text" wire:model="form.title">
    @error('form.title') <span>{{ $message }}</span> @enderror

    <textarea wire:model="form.content"></textarea>
    @error('form.content') <span>{{ $message }}</span> @enderror

    <button type="submit">Save</button>
</form>
```

Calling `$this->validate()` on the component validates the form too. The keys being prefixed with
`form.` is something to remember when you write tests: assert `form.title`, not `title`.

### One form for create and edit

A dependable pattern is a single form class with an optional model. The
[Livewire docs](https://livewire.laravel.com/docs/forms) use the same idea with a `setPost()`
method, and it holds up well in real screens:

```php
class PostForm extends Form
{
    public ?Post $post = null;

    #[Validate('required|min:5')]
    public string $title = '';

    #[Validate('required|min:20')]
    public string $content = '';

    public function setPost(Post $post): void
    {
        $this->post = $post;
        $this->title = $post->title;
        $this->content = $post->content;
    }

    public function store(): Post
    {
        $this->validate();

        return Post::create($this->only(['title', 'content']));
    }

    public function update(): void
    {
        $this->validate();

        $this->post->update($this->only(['title', 'content']));
    }
}
```

The edit component calls `setPost()` from `mount()`:

```php
class EditPost extends Component
{
    public PostForm $form;

    public function mount(Post $post): void
    {
        $this->form->setPost($post);
    }

    public function save(): void
    {
        $this->form->update();
    }
}
```

Keep `store()` and `update()` as two methods instead of one `save()` that branches on
`$this->post`. The branching version looks shorter but it hides which path ran, and the two paths
usually drift apart anyway: create sets an owner, update logs a change, and so on.

`$this->only([...])` is there on purpose. `all()` would include the `$post` property itself, which
you do not want to mass-assign.

The `?Post $post` property is safe to leave public. Livewire protects the ID of a public Eloquent
model property automatically, so a user cannot swap it for another record from the browser. That
is not true for a plain `int $postId`, which comes up again below.

### Rules that depend on the record

`#[Validate]` attributes take a string, so they cannot express `Rule::unique(...)->ignore($id)`.
For that, define `rules()` on the form:

```php
use Illuminate\Validation\Rule;

class PostForm extends Form
{
    public ?Post $post = null;

    #[Validate]
    public string $slug = '';

    public string $title = '';

    protected function rules(): array
    {
        return [
            'slug' => ['required', Rule::unique('posts', 'slug')->ignore($this->post)],
            'title' => ['required', 'min:5'],
        ];
    }
}
```

There is a behaviour difference here that is easy to miss. Rules defined only in `rules()` run
when you call `validate()`, not as each field updates. The empty `#[Validate]` on `$slug` opts that
one field back into validation on update while still reading its rule from `rules()`. That suits
fields where instant feedback is worth a request, like a slug or an email, while the rest can wait
for the submit.

For instant feedback the input needs a live binding. I prefer `.live.blur` over `.live` for text,
because it sends one request when the user leaves the field instead of one per pause in typing:

```blade
<input type="text" wire:model.live.blur="form.slug">
```

If you want no automatic validation at all, `#[Validate('required', onUpdate: false)]` turns it
off, and `$this->form->validate()` returns the validated data for you to save.

You can also add errors from inside the form with `$this->addError('slug', '...')`. Livewire
prefixes the key with the form's property name, so it lands under `form.slug` where your Blade
expects it.

### Uploads

`WithFileUploads` goes on the component, not on the form. The form can still hold the uploaded
file and do the storing:

```php
class ProfileForm extends Form
{
    #[Validate('nullable|image|max:2048')]
    public $avatar;

    public function store(User $user): void
    {
        $this->validate();

        if ($this->avatar) {
            $user->update(['avatar_path' => $this->avatar->store('avatars', 'public')]);
        }
    }
}
```

```php
use Livewire\WithFileUploads;

class EditProfile extends Component
{
    use WithFileUploads;

    public ProfileForm $form;
}
```

An earlier version of this post put the trait on the form class. That is not how the
[uploads docs](https://livewire.laravel.com/docs/uploads) show it, and the component is where the
upload endpoint is wired up.

### Resetting after save

`reset()` on a form restores properties to their declared defaults. `pull()` returns the values and
resets in one step, which reads nicely in a create flow:

```php
public function save(): void
{
    $this->validate();

    Post::create($this->form->pull());
}
```

One gotcha from the docs: a typed property without a default becomes uninitialized after a reset.
If you read it right after, PHP throws. Give every form property a default, even if it is `''` or
`null`.

### Where state should live

Form objects answer "where do the form fields go". They do not answer it for the rest of the
component, and a lot of Livewire bugs come from state sitting in the
wrong place. A search box stored only on the component loses its value on refresh. A filter stored
in the URL leaks into links people share. A list of records stored as a public property gets
serialized into the page on every request.

Livewire has an attribute for each of the places state can live, and choosing between them is
most of the design work.

#### `#[Url]` for state people should be able to link to

Search terms, filters, the current tab, sort order. If someone copies the address bar and sends
it to a colleague, should the colleague see the same thing? If yes, it goes in the URL:

```php
use Livewire\Attributes\Url;

class PostIndex extends Component
{
    #[Url(as: 'q', except: '')]
    public string $search = '';

    #[Url(history: true)]
    public string $status = 'published';
}
```

`as` renames the query parameter. `except` leaves it out of the URL when it equals that value, so
an empty search does not produce `?q=`. `history: true` pushes a new history entry instead of
replacing the current one, which makes the back button step through filter changes. It fits
filters that feel like navigation, like a tab, and is better left off for a search box
where every keystroke would become a history entry. The options are listed on the
[URL docs](https://livewire.laravel.com/docs/url).

#### `#[Session]` for preferences that should not be in the link

Some state should survive a refresh but should not travel with a shared link: the number of rows
per page, a collapsed sidebar, the last view mode someone picked. `#[Session]` stores the property
in the user's session whenever it changes and restores it on mount:

```php
use Livewire\Attributes\Session;

class PostIndex extends Component
{
    #[Session]
    public int $perPage = 25;

    #[Session(key: 'posts-view')]
    public string $view = 'table';
}
```

Without a key, Livewire builds one from the component and property names. The
[session docs](https://livewire.laravel.com/docs/attribute-session) warn that session data is
loaded on every request, so keep it to small values: strings, numbers, booleans, IDs.

#### `#[Computed]` for anything derived

The query results are not state. They are a function of the state. Storing them in a public
property means they are dehydrated into the HTML snapshot and sent back on every request, and they
go stale the moment the search changes. A computed property runs on demand and is memoized for the
rest of the request:

```php
use Livewire\Attributes\Computed;

#[Computed]
public function posts()
{
    return Post::query()
        ->where('status', $this->status)
        ->where('title', 'like', "%{$this->search}%")
        ->paginate($this->perPage);
}
```

In the view you access it as `$this->posts`, not `$posts`. If something inside the request changes
the data, `unset($this->posts)` clears the memo. `#[Computed(persist: true)]` caches the value
across requests for the component's lifetime on the page (an hour by default), and `cache: true`
shares it across every instance of the component. `persist` suits expensive aggregates on
dashboards; `cache` is rarely worth it, since a value shared between all users needs careful
invalidation. Details are on the
[computed properties page](https://livewire.laravel.com/docs/computed-properties).

#### `#[Locked]` for IDs the browser must not change

Every public property can be modified from the browser. That is the price of the request model.
For a scalar ID that decides which record an action touches, mark it locked:

```php
use Livewire\Attributes\Locked;

class DeletePostButton extends Component
{
    #[Locked]
    public int $postId;

    public function delete(): void
    {
        $post = Post::findOrFail($this->postId);

        $this->authorize('delete', $post);

        $post->delete();
    }
}
```

If the value is changed client side, Livewire throws instead of running the action. Two limits from
the [locked docs](https://livewire.laravel.com/docs/attribute-locked): your own PHP can still
change the property, and the lock is about tampering, not authorization. You still need
`authorize()`. As mentioned above, a public Eloquent model property gets this protection on its ID
without the attribute, which is one reason to pass the model rather than its ID.

### How to decide

When adding a property to a component, ask in order:

1. Is it typed by the user and submitted together with other fields? It goes on a form object.
2. Should a shared link reproduce it? `#[Url]`.
3. Should it survive a refresh but stay private? `#[Session]`.
4. Can it be calculated from other properties? `#[Computed]`, not a property at all.
5. Does it identify a record an action will touch? `#[Locked]`, or a model property.

Most of what is left after that list is short-lived UI state, like whether a modal is open, and a
lot of that belongs in Alpine rather than on the server.
