import * as React from "react";
import { TextInput, View } from "react-native";
import Button from "../Button";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { setUserAsync } from "../../state/features/user/userSlice";

interface IUserForm {

}

const UserForm: React.FC<IUserForm> = () => {
    const dispatch = useDispatch();

    const onFormSubmit = (data) => {
        dispatch(setUserAsync(data));
    }

    return (
        <Formik initialValues={{ email: "" }} onSubmit={onFormSubmit}>
            {({ handleChange, handleBlur, handleSubmit, values }) => (
                <View>
                    <TextInput 
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        value={values.email}
                    />
                    <Button onPress={handleSubmit}>
                        Submit
                    </Button>
                </View>
            )}
        </Formik>
    );
}

export default UserForm;