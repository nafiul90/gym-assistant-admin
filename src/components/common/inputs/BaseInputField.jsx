import { DeleteOutlined, EyeTwoTone } from "@ant-design/icons";
import {
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Slider,
    Switch,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useState } from "react";
import SelectInput from "./SelectInput";
// import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { IMAGE_URL } from "../../../helpers/Constant";
import ImageUploader from "../ImageUploader";
// import UploadService from "../../../services/UploadService";
import BaseFormComponent from "../BaseFormComponent";
import MyEditor from "./MyEditor";
import FileUploader from "../FileUploader";
import dayjs from "dayjs";

const InputField = ({
    type = "text",
    name,
    label,
    labelStyle,
    placeholder,
    value,
    onChange,
    onPressEnter,
    options,
    optionFieldName,
    className,
    getOptionsUrl,
    rules,
    form,
    autoFocus,
    formItem = false,
    limit = 1,
    fileList = [],
    uploadUrl,
    richTextRef,
    folderName,
    items,
    initialData,
    formData,
    ...props
}) => {
    console.log(name, value);
    const [newFileList, setNewFileList] = useState(
        limit === 1
            ? form?.getFieldValue(name)
                ? [form?.getFieldValue(name)]
                : []
            : (form?.getFieldValue(name) ?? [])
    );

    const onChangeHandle = (_value) => {
        onChange && onChange(name, _value);
        form && form.setFieldsValue({ [name]: _value });
        setNewFileList(_value);
    };

    const removeFile = (url) => {
        const _newFieList = newFileList.filter(
            (e) => `${IMAGE_URL}/${e}` !== url
        );
        form && form.setFieldsValue({ [name]: _newFieList });
        setNewFileList(_newFieList);
    };

    // const quillRef = useRef();

    // const imageHandler = (e) => {
    //     const editor = quillRef.current.getEditor();
    //     const input = document.createElement("input");
    //     input.setAttribute("type", "file");
    //     input.setAttribute("accept", "image/*");
    //     input.click();

    //     input.onchange = async () => {
    //         const file = input.files[0];
    //         if (/^image\//.test(file.type)) {
    //             const formData = new FormData();
    //             formData.append("image", file);
    //             const res = await UploadService.upload(
    //                 UPLOAD_IMAGE_URL,
    //                 formData
    //             );
    //             const url = `${IMAGE_URL}/${res?.data}`;
    //             editor.insertEmbed(editor.getSelection(), "image", url);
    //         } else {
    //             // console.log("Erorr");
    //         }
    //     };
    // };

    // const EditorModules = useMemo(
    //     () => ({
    //         toolbar: {
    //             container: [
    //                 [{ header: "1" }, { header: "2" }, { font: [] }],
    //                 [{ size: [] }],
    //                 ["bold", "italic", "underline", "strike", "blockquote"],
    //                 [
    //                     { list: "ordered" },
    //                     { list: "bullet" },
    //                     { indent: "-1" },
    //                     { indent: "+1" }
    //                 ],
    //                 ["link", "image"],
    //                 ["clean"]
    //             ],
    //             handlers: {
    //                 image: imageHandler
    //             },
    //             clipboard: {
    //                 // toggle to add extra line breaks when pasting HTML:
    //                 matchVisual: false
    //             }
    //         }
    //     }),
    //     []
    // );

    let inputField = (
        <Input
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={(e) => onChangeHandle(e.target.value)}
            onPressEnter={onPressEnter}
            autoFocus={autoFocus}
            {...props}
        />
    );

    if (type === "number") {
        inputField = (
            <InputNumber
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={(e) => onChangeHandle(e)}
                onPressEnter={onPressEnter}
                stringMode={"false"}
                autoFocus={autoFocus}
            />
        );
    }
    if (type === "password") {
        inputField = (
            <Input.Password
                addonBefore={
                    <img
                        src="/icons/password-new-icon.svg"
                        width={24}
                        height={24}
                        alt="pass-icon"
                    />
                }
                placeholder={placeholder}
                onChange={onChangeHandle}
                value={value}
                size="small"
                iconRender={(visible) =>
                    visible ? (
                        <div style={{ height: 20, width: 20 }}>
                            <EyeTwoTone
                                style={{ color: "#64748B", fontSize: 20 }}
                            />
                        </div>
                    ) : (
                        <img
                            src="/icons/password-eye.svg"
                            alt=""
                            height={20}
                            width={20}
                        />
                    )
                }
            />
        );
    }

    if (type === "dropdown") {
        inputField = (
            <SelectInput
                placeholder={placeholder}
                value={value}
                onChange={onChangeHandle}
                options={options}
                optionFieldName={optionFieldName}
                getOptionsUrl={getOptionsUrl}
                {...props}
            />
        );
    }

    if (type === "multipleSelect") {
        inputField = (
            <SelectInput
                placeholder={placeholder}
                value={value}
                onChange={onChangeHandle}
                options={options}
                optionFieldName={optionFieldName}
                getOptionsUrl={getOptionsUrl}
                {...props}
            />
        );
    }

    if (type === "date") {
        inputField = (
            <DatePicker
                placeholder={placeholder}
                onChange={(_date, dateStr) =>
                    onChangeHandle(formItem ? _date : dateStr)
                }
                format={"DD MMMM YYYY"}
                value={value && dayjs(value)}
                {...props}
            />
        );
    }
    if (type === "richtext") {
        inputField = (
            // <ReactQuill
            //     ref={quillRef}
            //     theme="snow"
            //     modules={EditorModules}
            //     formats={formats}
            //     onChange={onChangeHandle}
            //     placeholder={placeholder}
            //     value={value}
            //     {...props}
            // />
            <MyEditor
                placeholder={placeholder}
                editorRef={richTextRef}
                value={value}
                onChange={onChangeHandle}
            />
        );
    }
    if (type === "textarea") {
        inputField = (
            <TextArea
                value={value}
                onChange={(e) => onChangeHandle(e.target.value)}
                placeholder={placeholder}
                autoSize={{ minRows: 3, maxRows: 5 }}
            />
        );
    }
    if (type === "multiple-form") {
        inputField = (
            <MultiForm
                items={items}
                form={form}
                data={formData ? formData[name] : []}
                name={name}
                {...props}
            />
        );
    }
    if (type === "slider") {
        inputField = (
            <Slider
                value={value}
                onChange={onChangeHandle}
                placeholder={placeholder}
                {...props}
            />
        );
    }
    if (type === "switch") {
        inputField = <Switch value={value} onChange={onChangeHandle} />;
    }
    if (type === "image") {
        inputField = (
            <ImageUploader
                limit={limit}
                fileList={
                    limit === 1 && newFileList.length > 0
                        ? [newFileList]
                        : newFileList
                }
                uploadPath={uploadUrl}
                onUpload={(url) =>
                    onChangeHandle(limit === 1 ? url : [...newFileList, url])
                }
                onRemove={(url) =>
                    limit === 1
                        ? form.setFieldsValue({ name: null })
                        : removeFile(url)
                }
                folderName={folderName}
            />
        );
    }
    if (type === "file") {
        inputField = (
            <FileUploader
                limit={limit}
                fileList={
                    limit === 1 && newFileList.length > 0
                        ? [newFileList]
                        : newFileList
                }
                uploadPath={uploadUrl}
                onUpload={(url) =>
                    onChangeHandle(limit === 1 ? url : [...newFileList, url])
                }
                onRemove={(url) =>
                    limit === 1
                        ? form.setFieldsValue({ name: null })
                        : removeFile(url)
                }
                folderName={folderName}
            />
        );
    }
    if (formItem) {
        inputField = (
            <Form.Item label={label} name={name} rules={rules}>
                {inputField}
            </Form.Item>
        );
    } else {
        inputField = (
            <>
                <p className={`${labelStyle}`}>{label}</p>
                {inputField}
            </>
        );
    }

    return <div className={className}>{inputField}</div>;
};

/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
// const formats = [
//     "header",
//     "font",
//     "size",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "blockquote",
//     "list",
//     "bullet",
//     "indent",
//     "link",
//     "image"
// ];

const MultiForm = ({
    items,
    form,
    name,
    data,
    boxClassName,
    formClassName,
}) => {
    const [_data, setData] = useState(data ?? []);
    const [addNew, setAddNew] = useState(false);

    return (
        <div className={`border rounded-lg p-4 ${boxClassName}`}>
            {_data?.map((e, i) => (
                <div key={`${i}-${e.name}}`} className={formClassName}>
                    <div className="flex justify-between">
                        <div className="flex justify-center items-center border rounded-full h-6 w-6">
                            {i + 1}
                        </div>
                        <DeleteOutlined
                            style={{ color: "red" }}
                            onClick={() => {
                                const __data = _data.filter(
                                    (_, idx) => idx !== i
                                );
                                setData(__data);
                                form.setFieldValue(name, __data);
                            }}
                        />
                    </div>
                    <div className="my-4">
                        <BaseFormComponent
                            key={`${i}-${e.name}}`}
                            formItems={items}
                            data={e}
                            onChange={(event) => {
                                const value = event.target.value;
                                const _name = event.target.name;
                                const __data = [..._data];
                                __data[i] = { ...__data[i], [_name]: value };
                                setData(__data);
                                form.setFieldValue(name, __data);
                            }}
                            footer={(_) => <></>}
                        />
                    </div>
                </div>
            ))}
            <div className={formClassName}>
                {addNew ? (
                    <BaseFormComponent
                        formItems={items}
                        footer={(_form) => {
                            return (
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const newData = [
                                            ..._data,
                                            _form.getFieldsValue(),
                                        ];
                                        setData(newData);
                                        form.setFieldValue(name, newData);
                                        setAddNew(false);
                                    }}
                                >
                                    Add
                                </Button>
                            );
                        }}
                    />
                ) : (
                    <Button onClick={() => setAddNew(!addNew)}>Add new</Button>
                )}
            </div>
        </div>
    );
};

export default InputField;
