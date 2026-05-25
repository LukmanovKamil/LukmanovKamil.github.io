export function Modal(titleText, subtitleText, yesText, noText) {
    const modal = document.querySelector(".modal");
    const body = document.body;

    const title = modal.querySelector(".modal-title");
    const subtitle = modal.querySelector(".modal-subtitle");
    const yes = modal.querySelector(".modal-yes");
    const no = modal.querySelector(".modal-no");

    return new Promise((resolve) => {

        title.innerHTML = titleText;
        subtitle.innerHTML = subtitleText;
        yes.textContent = yesText;
        no.textContent = noText;

        body.style.overflow = "hidden";
        modal.style.display = "flex";

        function close(result) {
            body.style.overflow = "";
            modal.style.display = "none";

            modal.onclick = null;
            yes.onclick = null;
            no.onclick = null;

            resolve(result);
        }

        yes.onclick = () => close(true);
        no.onclick = () => close(false);

        modal.onclick = (e) => {
            if (e.target === modal) close(false);
        };
    });
}