export function Modal(title, subtitle, yes, no) {
    const body = document.body;

    const modal = document.createElement("div");
    modal.id = "modal";

    const modalCard = document.createElement("div");
    modalCard.id = "modal-card";

    const modalTitles = document.createElement("div");
    modalTitles.id = "modal-titles";

    const modalTitle = document.createElement("div");
    modalTitle.id = "modal-title";

    const modalSubtitle = document.createElement("div");
    modalSubtitle.id = "modal-subtitle";

    const modalButton = document.createElement("div");
    modalButton.id = "modal-button";

    const modalYes = document.createElement("button");
    modalYes.id = "modal-yes";

    const modalNo = document.createElement("button");
    modalNo.id = "modal-no";

    document.body.appendChild(modal);

    modal.append(modalCard);
    modalCard.append(modalTitles, modalButton);
    modalTitles.append(modalTitle, modalSubtitle);
    modalButton.append(modalYes, modalNo);

    return new Promise((resolve) => {

        modalTitle.innerHTML = title;
        modalSubtitle.innerHTML = subtitle;
        modalYes.textContent = yes;

        if (no) {
            modalNo.textContent = no;
        } else {
            modalNo.style.display = "none";
        }

        modal.style.display = "flex";

        function close(result) {
            body.style.overflow = "";
            modal.style.display = "none";

            modal.onclick = null;
            modalYes.onclick = null;
            modalNo.onclick = null;

            modal.remove();

            resolve(result);
        }

        modalYes.onclick = () => close(true);
        modalNo.onclick = () => close(false);

        modal.onclick = (e) => {
            if (e.target === modal) close(false);
        };
    });
}