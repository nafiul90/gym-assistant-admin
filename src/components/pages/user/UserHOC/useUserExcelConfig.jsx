export const useUserExcelConfig = (users = []) => {
    return users.map((user, index) => ({
        "S/N": index + 1,
        "User Id": user.userId ?? "",
        "Full Name": user.fullName || "",
        Phone: user.phone || "",
        Gender: user.gender || "",
        Type: user.type || "",
    }));
};
