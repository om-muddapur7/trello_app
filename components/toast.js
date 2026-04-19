const path = require("path");
app.use(express.static(path.join(__dirname, "..")));

(function () {

    const container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);

    const style = document.createElement("style");
    style.innerHTML = `
        #toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .toast {
            min-width: 220px;
            padding: 12px 16px;
            border-radius: 10px;
            color: white;
            font-size: 14px;
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(10px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.2);

            opacity: 0;
            transform: translateX(30px);
            transition: all 0.3s ease;
        }

        .toast.show {
            opacity: 1;
            transform: translateX(0);
        }

        .toast.success {
            border-left: 4px solid #22c55e;
        }

        .toast.error {
            border-left: 4px solid #ef4444;
        }

        .toast.info {
            border-left: 4px solid #3b82f6;
        }
    `;
    document.head.appendChild(style);

    window.showToast = function (message, type = "info") {
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.innerText = message;

        container.appendChild(toast);

        setTimeout(() => toast.classList.add("show"), 10);

        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    };
})();