"use client";

import { Children, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import api from "../../services/Api";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const DownloadExcel = ({
    fileName,
    dataUrl,
    getConfig,
    searchparams,
    isLocalFile = false,
    localFile,
    children,
}) => {
    const [loading, setLoading] = useState(false);

    const exportToExcel = (data) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, fileName || "Sheet1");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `${fileName || "download"}.xlsx`);
    };

    const download = async () => {
        setLoading(true);
        if (!isLocalFile) {
            const callback = (res) => {
                const formattedData = getConfig(res.data?.content ?? res.data);
                exportToExcel(formattedData);
                setLoading(false);
            };

            api.getAllData(
                {
                    url: dataUrl,
                    setLoading,
                    params: { ...searchparams, page: 1, size: 100000 },
                },
                callback,
            );
        } else {
            console.log("localfile - > ", localFile);
            const formattedData = getConfig ? getConfig(localFile) : localFile;
            exportToExcel(formattedData);
            setLoading(false);
        }
    };

    return (
        <>
            <div className="">
                <Button loading={loading} onClick={() => download()}>
                    {children ?? <DownloadOutlined />}
                </Button>
            </div>
        </>
    );
};

export default DownloadExcel;
