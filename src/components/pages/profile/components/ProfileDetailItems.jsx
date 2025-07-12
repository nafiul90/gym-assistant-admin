import _ from "lodash";
import { useContext } from "react";
import { AuthContext } from "../../../../contexts/AuthContextProvider";
import { getDetailItems } from "../../../../helpers/Utils";

const ProfileDetailItems = () => {
    const { profile } = useContext(AuthContext);

    const data = _.pick(profile, "fullName", "phone", "email", "gender");
    // data.role = profile.role?.alias;

    return getDetailItems(data, 1, "", "horizontal");
};

export default ProfileDetailItems;
