import JoditEditor from "jodit-react";
import React, { useMemo, useState } from "react";
// import {
//     ACCESS_TOKEN,
//     IMAGE_URL,
//     RICH_TEXT_IMAGE_UPLOAD_URL
// } from "@/components/_helpers/Constant";
// import { useSelector } from "react-redux";
import { Modal } from "antd";
import {
    ACCESS_TOKEN,
    IMAGE_URL,
    UPLOAD_IMAGE_URL
} from "../../../helpers/Constant";

const MyEditor = ({
    onChange,
    value,
    placeholder,
    editorRef = null,
    folderName
}) => {
    const [showPreview, setShowPreview] = useState(false);
    const [content, setContent] = useState("");
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    // const isDark = useSelector(
    //     (state) =>
    //         state.themeConfig.theme === "dark" || state.themeConfig.isDarkMode
    // );
    const config = useMemo(
        () => ({
            placeholder: placeholder || "Start typing...",
            // theme: isDark ? "dark" : "default",
            iframe: true,
            useSearch: false,
            events: {
                afterInit: (instance) => {
                    if (editorRef !== null) {
                        editorRef.current = instance;
                    }
                },
                beforeCommand: (command, editor, event, control) => {
                    if (command === "preview") {
                        //   event.preventDefault(); // Prevent the default preview action
                        handleShowPreview(); // Call your custom preview function
                        return false;
                    }
                }
            },
            removeButtons: [
                "file",
                "speechRecognize",
                "print",
                "about",
                "fullsize"
            ],
            uploader: {
                insertImageAsBase64URI: false,
                imagesExtensions: ["jpg", "png", "jpeg", "gif"],
                withCredentials: false,
                format: "json",
                method: "POST",
                url: `${UPLOAD_IMAGE_URL}`,
                headers: {
                    // 'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${accessToken}`
                },
                prepareData: function (formData) {
                    const file = formData.getAll("files[0]")[0];
                    formData.delete("files[0]");
                    formData.delete("path");
                    formData.delete("source");
                    formData.append("image", file);
                    return formData;
                },
                isSuccess: function (resp) {
                    return !resp.error;
                },
                getMsg: function (resp) {
                    return resp.msg.join !== undefined
                        ? resp.msg.join(" ")
                        : resp.msg;
                },
                process: function (resp) {
                    const newImageUrl = `${IMAGE_URL}/${resp?.url}`;
                    return {
                        files: [newImageUrl],
                        path: "",
                        baseurl: "",
                        error: resp.error ? 1 : 0,
                        msg: resp.msg
                    };
                },
                defaultHandlerSuccess: function (data, resp) {
                    const files = data.files || [];

                    if (files.length) {
                        this.selection.insertImage(files[0], null, 250);
                    }
                },
                defaultHandlerError: function (resp) {
                    this.events.fire("errorPopap", this.i18n(resp.msg));
                }
            }

            // buttons: [
            //     ...this.defaultOptions.buttons,
            //     {
            //         name: 'insertDate',
            //         tooltip: 'Insert current Date',
            //         exec: (editor) => {
            //             console.log(editor);
            //             editor.s.insertHTML(new Date().toDateString());
            //         }
            //     }
            // ]
        }),
        [placeholder]
    );
    const onEditorValueChange = (newContent) => {
        newContent = newContent.replaceAll(
            "list-style-type: circle;",
            "list-style-type: circle !important;"
        );
        newContent = newContent.replaceAll(
            "list-style-type: square;",
            "list-style-type: square !important;"
        );
        setContent(newContent);
        onChange && onChange(newContent);
    };

    const handleShowPreview = () => {
        setShowPreview(!showPreview);
    };

    return (
        <div className="relative my-editor">
            <JoditEditor
                ref={editorRef}
                value={value}
                config={config}
                tabIndex={5}
                onBlur={onEditorValueChange}
                onChange={() => {}}
            />

            <Modal
                open={showPreview}
                onCancel={() => setShowPreview(false)}
                footer={null}
                width={1000}
                height={800}
            >
                <div className="p-10">
                    <p>Preview</p>
                    <div
                        className="overflow-hidden border p-2 my-editor-preview"
                        dangerouslySetInnerHTML={{ __html: content }}
                    ></div>
                </div>
            </Modal>
        </div>
    );
};

export default MyEditor;
