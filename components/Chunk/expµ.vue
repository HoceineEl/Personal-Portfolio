<template>
  <html>
    <body>
      <div>
        <button>+</button>
             0
        <button>-</button>
      </div>
    </body>
  </html>
</template>

<script setup>
const virtualDOM = {
    type: "html",
    children: [
        {
            type: "body",
            children: [
                {
                    type: "div",
                    children: [
                        { type: "button", text: "+" },
                        "0", 
                        { type: "button", text: "-" }
                    ]
                }
            ]
        }
    ]
};

</script>

<style lang="scss" scoped></style>
