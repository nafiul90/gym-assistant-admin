import React from "react";

const CustomTable = ({ columns, dataSource }) => {
    return (
        <table style={{ fontSize: "10px", margin: "0 auto" }}>
            <tr style={{ border: "1px solid #ababab" }}>
                {columns.map((e) => (
                    <th
                        key={e.key}
                        style={{
                            width: `${e.width}px`,
                            padding: "5px",
                            border: "1px solid #ababab"
                        }}
                    >
                        {e.title}
                    </th>
                ))}
            </tr>
            {dataSource.map((data, i) => (
                <tr key={i} style={{ border: "1px solid #ababab" }}>
                    {columns.map((e, i) => (
                        <td
                            key={i}
                            style={{
                                width: `${e.width}px`,
                                padding: "5px",
                                border: "1px solid #ababab"
                            }}
                        >
                            {e.render ? e.render(data) : data[e.dataIndex]}
                        </td>
                    ))}
                </tr>
            ))}
        </table>
    );
};

export default CustomTable;
