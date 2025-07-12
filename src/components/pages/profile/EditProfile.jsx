import React, { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContextProvider";
import { UPDATE_USER_URL } from "../../../helpers/Constant";
import BaseFormComponent from "../../common/BaseFormComponent";
import useFormItems from "./ProfileHOC/useFormItems";

const EditProfile = () => {
    const formItems = useFormItems(true);
    const { profile } = useContext(AuthContext);

    return (
        <div>
            <BaseFormComponent
                formItems={formItems}
                data={profile}
                submitUrl={`${UPDATE_USER_URL}/${profile?._id}`}
                actionLayoutClassName="grid grid-flow-row-dense grid-cols-6 gap-3 mt-4"
            />
        </div>
    );
};

export default EditProfile;
