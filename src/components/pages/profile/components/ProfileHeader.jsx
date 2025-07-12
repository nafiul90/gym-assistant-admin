import React, { useContext, useState } from "react";
import { Button, Divider, Form, Modal } from "antd";
import { AuthContext } from "../../../../contexts/AuthContextProvider";
import { IMAGE_URL, UPLOAD_PROFILE_IMAGE } from "../../../../helpers/Constant";
import ImageUploader from "../../../common/ImageUploader";
import EditProfile from "../EditProfile";

const ProfileHeader = () => {
    const [isEditProfileModal, setEditProfileModal] = useState(false);
    const { profile } = useContext(AuthContext);
    const handleCancel = () => {
        setEditProfileModal(false);
    };
    const showModal = () => {
        setEditProfileModal(true);
    };
    return (
        <div className="h-30 my-10 mx-8 flex justify-between">
            <HeaderLeft profile={profile} />
            <Button type="primary" onClick={showModal}>
                Edit Profile
            </Button>
            <Modal
                title="Edit profile"
                open={isEditProfileModal}
                footer={null}
                onCancel={handleCancel}
            >
                <EditProfile />
            </Modal>
        </div>
    );
};

const HeaderLeft = ({ data }) => {
    // const [form] = Form.useForm();
    const authContext = useContext(AuthContext);
    const clearGym = () => {
        authContext.switchGym();
    };
    return (
        <div className="flex items-center gap-2">
            <ImageUploader
                limit={1}
                listType="picture-circle"
                fileList={
                    data?.profilePicture
                        ? [`${IMAGE_URL}/${data?.profilePicture}`]
                        : []
                }
                uploadPath={UPLOAD_PROFILE_IMAGE}
                // onUpload={(url) => form.setFieldsValue({ thumbnailImage: url })}
                // onRemove={() => form.setFieldsValue({ thumbnailImage: null })}
            />
            <div>
                <Button onClick={clearGym}>Clear Gym</Button>
                <p>{data?.fullName}</p>
                <Divider />
                <p>{data?.phone}</p>
            </div>
        </div>
    );
};

export default ProfileHeader;
