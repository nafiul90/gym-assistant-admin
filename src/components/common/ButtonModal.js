import { Button, Modal } from "antd";
import React, { useState } from "react";

const ButtonModal = ({
    children,
    title,
    buttonChildren,
    buttonType,
    buttonSize,
    modalConfig
}) => {
    const [isShow, setIsShow] = useState(false);

    const showModal = () => {
        setIsShow(true);
    };

    const onClose = () => {
        setIsShow(false);
    };

    return (
        <>
            <Button type={buttonType} size={buttonSize} onClick={showModal}>
                {buttonChildren}
            </Button>
            <Modal
                centered
                title={title}
                visible={isShow}
                footer={null}
                onCancel={onClose}
                {...modalConfig}
            >
                {children}
            </Modal>
        </>
    );
};

export default ButtonModal;
