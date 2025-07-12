import { Modal } from "antd";

export default (message, type) => {
    let secondsToGo = 5;
    const modal = Modal[type]({
        title: message,
        content: `${secondsToGo}`
    });
    const timer = setInterval(() => {
        secondsToGo -= 1;
        modal.update({
            content: `${secondsToGo}`
        });
    }, 1000);
    setTimeout(() => {
        clearInterval(timer);
        modal.destroy();
    }, secondsToGo * 1000);
};
