import { message, Upload } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { IMAGE_URL } from "../../helpers/Constant";
import { getErrorMessage } from "../../helpers/Utils";
import UploadService from "../../services/UploadService";
import LoadingSuspense from "./LoadingSuspense";
import { Toast } from "./Toast";

const ImageUploader = forwardRef((props, ref) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [fileList, setFileList] = useState([
        ...props.fileList.map((e, i) => ({
            uid: i,
            status: "done",
            url: IMAGE_URL + "/" + e,
        })),
    ]);

    const onRemove = (file) => {
        setFileList([...fileList.filter((e) => e.uid !== file.uid)]);
        if (props.onRemove) {
            props.onRemove(file.url);
        }
    };

    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
    };

    function beforeUpload(file) {
        const isJpgOrPng =
            file.type === "image/jpeg" ||
            file.type === "image/png" ||
            file.type === "image/webp";
        if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG/WEBP file!");
        }
        const isLt2M = file.size / 10000 / 10000 < 10;
        if (!isLt2M) {
            message.error("Image must smaller than 10MB!");
        }
        setError(!(isJpgOrPng && isLt2M));
        return isJpgOrPng && isLt2M;
    }

    const uploadFile = async (data) => {
        if (error) {
            return;
        }
        const formData = new FormData();

        formData.append("image", data.file);

        try {
            setLoading(true);
            const res = await UploadService.upload(
                `${props.uploadPath}?folderName=${props.folderName}`,
                formData
            );
            setLoading(false);
            setFileList([
                ...fileList,
                {
                    uid: fileList.length,
                    status: "done",
                    url: `${IMAGE_URL}/${res.data?.url}`,
                },
            ]);
            props.onUpload(res.data?.url);
        } catch (error) {
            setLoading(false);
            const message = getErrorMessage(error);
            Toast("error", "Error", "Can not upload image ! " + message);
        }
    };

    useImperativeHandle(ref, () => ({
        clearData() {
            setFileList([]);
            setLoading(false);
            setError(false);
        },
    }));

    return (
        <Upload
            customRequest={uploadFile}
            listType={props.listType ?? "picture-card"}
            className="avatar-uploader"
            fileList={fileList}
            onRemove={onRemove}
            onPreview={onPreview}
            beforeUpload={beforeUpload}
        >
            {loading ? (
                <LoadingSuspense />
            ) : (
                fileList.length < props.limit && "+ Upload"
            )}
        </Upload>
    );
});
ImageUploader.displayName = "ImageUploader";
export default ImageUploader;
