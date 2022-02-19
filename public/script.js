const canvas = $("#canvas_area");
const submit = $("#submit_button");
const canvasInput = $('input[type="hidden"]');
const clear_button = $("#clear_botton");



canvas.on("mousedown", function (e) {

    const context = canvas[0].getContext("2d");
    const canvasX = canvas[0].clientWidth;
    const canvasY = canvas[0].clientHeight;

    const startX = e.offsetX;
    const startY = e.offsetY;

    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = "#000";

    context.moveTo(startX, startY);



    canvas.on("mousemove", function moveTo(e) {
        const currentX = e.offsetX;
        const currentY = e.offsetY;

        if (currentX >= canvasX || currentY >= canvasY) {
            context.closePath();
            canvas.off("mousemove", moveTo);
        } else {
            context.lineTo(currentX, currentY);
            context.stroke();
        }
        canvas.on("mouseup", function () {

            const dataUrl = canvas[0].toDataURL();
            canvasInput.val(dataUrl);

            context.closePath();
            canvas.off("mousemove", moveTo);
        });
    });


})

clear_button.on("click", function () {
    canvasInput.val("");
})



