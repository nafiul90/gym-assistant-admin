import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { FILE_URL } from "../../helpers/Constant";
import { getErrorMessage } from "../../helpers/Utils";
import UploadService from "../../services/UploadService";
import LoadingSuspense from "./LoadingSuspense";
import { Toast } from "./Toast";

const FileUploader = forwardRef(
    ({ fileList, uploadPath, onUpload, onRemove, limit, accept }, ref) => {
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(false);
        const [_fileList, setFileList] = useState([
            ...fileList.map((e, i) => ({
                uid: i,
                status: "done",
                url: e,
                name: e
            }))
        ]);

        const _onRemove = (file) => {
            setFileList([..._fileList.filter((e) => e.uid !== file.uid)]);
            if (onRemove) {
                onRemove(file.url);
            }
        };

        function beforeUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error("File must smaller than 2MB!");
            }
            setError(!isLt2M);
            return isLt2M;
        }

        const uploadFile = async (data) => {
            if (error) {
                return;
            }

            const formData = new FormData();

            formData.append("file", data.file);

            try {
                setLoading(true);
                const res = await UploadService.upload(uploadPath, formData);
                setLoading(false);
                setFileList([
                    ..._fileList,
                    {
                        uid: _fileList.length,
                        status: "done",
                        url: res.data,
                        name: data.file.name
                    }
                ]);
                onUpload(res.data);
            } catch (error) {
                setLoading(false);
                const message = getErrorMessage(error);
                Toast("error", "Error", "Can not upload file! " + message);
            }
        };

        useImperativeHandle(ref, () => ({
            clearData() {
                setFileList([]);
                setLoading(false);
                setError(false);
            }
        }));

        const onPreview = async (file) => {
            let src = file.url;
            if (!src) {
                src = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file.originFileObj);
                    reader.onload = () => resolve(reader.result);
                });
            } else {
                src = `${FILE_URL}/${src}`;
            }
            window.open(src);
        };

        return (
            <Upload
                customRequest={uploadFile}
                fileList={_fileList}
                onRemove={_onRemove}
                beforeUpload={beforeUpload}
                accept={accept}
                onPreview={onPreview}
            >
                {loading ? (
                    <LoadingSuspense />
                ) : (
                    _fileList.length < limit && (
                        <Button icon={<UploadOutlined />}>Upload</Button>
                    )
                )}
            </Upload>
        );
    }
);

FileUploader.defaultProps = {
    limit: 1,
    accept: ""
};

FileUploader.displayName = "FileUploader";
export default FileUploader;
