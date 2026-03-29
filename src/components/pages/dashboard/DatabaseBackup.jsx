import { useState } from "react";
import {
    Alert,
    Button,
    Card,
    Divider,
    Space,
    Typography,
} from "antd";
import {
    DatabaseOutlined,
    DownloadOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import { ACCESS_TOKEN, ADMIN_DASHBOARD_BACKUP } from "../../../helpers/Constant";

const { Text, Title, Paragraph } = Typography;

// ── Shared fetch helper ───────────────────────────────────────────────────────

const authHeaders = () => ({
    "Content-Type": "application/json",
    "x-auth-token": localStorage.getItem(ACCESS_TOKEN) || "",
});

// ── Download section ──────────────────────────────────────────────────────────

const DownloadSection = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const download = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${ADMIN_DASHBOARD_BACKUP}/download`, {
                method: "POST",
                headers: authHeaders(),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.message || `Server error ${res.status}`);
            }

            // Extract filename from Content-Disposition header if present
            const disposition = res.headers.get("Content-Disposition") || "";
            const match = disposition.match(/filename="([^"]+)"/);
            const filename = match ? match[1] : "gym-assistant-backup.zip";

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            title={
                <Space>
                    <DownloadOutlined />
                    <span>Download Backup</span>
                </Space>
            }
            style={{ marginBottom: 24 }}
        >
            <Paragraph type="secondary">
                Creates a <strong>mongodump</strong> of the <code>gym-assistant</code> database,
                zips it, and downloads the zip file directly to your browser.
            </Paragraph>

            {error && (
                <Alert type="error" message={error} showIcon style={{ marginBottom: 12 }} />
            )}

            <Button
                type="primary"
                icon={<DownloadOutlined />}
                loading={loading}
                onClick={download}
                size="large"
            >
                {loading ? "Creating backup…" : "Download Database Backup"}
            </Button>
        </Card>
    );
};

// ── Upload to Drive section ───────────────────────────────────────────────────

const UploadDropboxSection = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const upload = async () => {
        setLoading(true);
        setResult(null);
        setError(null);
        try {
            const res = await fetch(`${ADMIN_DASHBOARD_BACKUP}/upload-dropbox`, {
                method: "POST",
                headers: authHeaders(),
            });

            const body = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(body.message || `Server error ${res.status}`);
            setResult(body);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            title={
                <Space>
                    <UploadOutlined />
                    <span>Upload to Dropbox</span>
                </Space>
            }
            style={{ marginBottom: 24 }}
        >
            <Paragraph type="secondary">
                Creates a backup zip and uploads it directly to Dropbox
                under <code>/gym-assistant-backups/</code>. The cron job also runs this
                automatically at <strong>2:00 PM</strong> and <strong>11:30 PM</strong> Dhaka time every day.
            </Paragraph>

            {error && (
                <Alert type="error" message={error} showIcon style={{ marginBottom: 12 }} />
            )}

            {result && (
                <Alert
                    type="success"
                    showIcon
                    style={{ marginBottom: 12 }}
                    message="Uploaded to Dropbox successfully"
                    description={
                        <div>
                            <Text>File: <strong>{result.dropboxFile?.name}</strong></Text>
                            <br />
                            <Text type="secondary">Path: {result.dropboxFile?.path_display}</Text>
                            <br />
                            <Text type="secondary">
                                Size: {result.dropboxFile?.size ? `${(result.dropboxFile.size / 1024 / 1024).toFixed(2)} MB` : "—"}
                            </Text>
                        </div>
                    }
                />
            )}

            <Button
                type="primary"
                icon={<UploadOutlined />}
                loading={loading}
                onClick={upload}
                size="large"
            >
                {loading ? "Uploading to Dropbox…" : "Upload Backup to Dropbox"}
            </Button>
        </Card>
    );
};

// ── Main page ─────────────────────────────────────────────────────────────────

const DatabaseBackup = () => {
    return (
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <Space align="center" style={{ marginBottom: 4 }}>
                <DatabaseOutlined style={{ fontSize: 20 }} />
                <Title level={4} style={{ margin: 0 }}>Database Backup</Title>
            </Space>
            <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
                Manage MongoDB backups. Download a zip to your machine or push it directly
                to Dropbox. Automatic Dropbox uploads run at 2:00 PM and 11:30 PM (Dhaka time).
            </Text>
            <Divider />
            <DownloadSection />
            <UploadDropboxSection />
        </div>
    );
};

export default DatabaseBackup;
