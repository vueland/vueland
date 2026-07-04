<template>
    <div class="d-flex flex-col align-center gap-4 pa-8">
        <div class="d-flex gap-3">
            <c-btn color="red-darken-1">
                red-darken-1
            </c-btn>
            <c-btn color="teal">
                teal
            </c-btn>
            <c-btn color="deep-purple-lighten-1">
                deep-purple
            </c-btn>
        </div>

        <div class="d-flex gap-3">
            <c-btn color="#7C4DFF">
                #7C4DFF
            </c-btn>
            <c-btn color="rgb(0,150,136)">
                rgb(0,150,136)
            </c-btn>
        </div>

        <div class="d-flex gap-3">
            <c-btn
                variant="outlined"
                color="red-darken-1"
            >
                outlined red
            </c-btn>
            <c-btn
                variant="outlined"
                color="#7C4DFF"
            >
                outlined #7C4DFF
            </c-btn>
        </div>
    </div>
</template>
