import { useState } from "react";
import { Formik, Form, Field } from "formik";
import Joi from "@hapi/joi";
import Cookies from "js-cookie";

import styles from "../../styles/Form.module.css";
import { useRegisterMutation } from "../../redux/features/auth/authApiSlice";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const navigate = useNavigate();
  const [userInputs, setUserInputs] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  // Define the validation schema using Joi
  const validationSchema = Joi.object({
    first_name: Joi.string().min(2).max(30).required(),
    last_name: Joi.string().min(2).max(30).required(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    password: Joi.string().min(6).required(),
  });

  // Validation function using Joi schema
  const validate = (values) => {
    const { error } = validationSchema.validate(values, { abortEarly: false });
    const errors = {};
    if (error) {
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });
    }
    return errors;
  };

  const [register, { isError, isLoading, error }] = useRegisterMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await register({
        first_name: userInputs.first_name,
        last_name: userInputs.last_name,
        email: userInputs.email,
        password: userInputs.password,
      });
      const accessToken = data.accessToken;
      if (accessToken) {
        Cookies.set("accessToken", accessToken);
        setUserInputs({
          email: "",
          first_name: "",
          last_name: "",
          password: "",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {" "}
      <Formik
        initialValues={{
          first_name: "",
          last_name: "",
          email: "",
          password: "",
        }}
        validate={validate}
      >
        <Form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="first_name">First Name</label>
            <Field
              type="text"
              name="first_name"
              value={userInputs.first_name}
              onChange={(e) =>
                setUserInputs((prev) => {
                  return { ...prev, first_name: e.target.value };
                })
              }
            />
          </div>
          <div>
            <label htmlFor="last_name">Last Name</label>
            <Field
              type="text"
              name="last_name"
              value={userInputs.last_name}
              onChange={(e) =>
                setUserInputs((prev) => {
                  return { ...prev, last_name: e.target.value };
                })
              }
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <Field
              type="email"
              name="email"
              value={userInputs.email}
              onChange={(e) =>
                setUserInputs((prev) => {
                  return { ...prev, email: e.target.value };
                })
              }
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <Field
              type="password"
              name="password"
              value={userInputs.password}
              onChange={(e) =>
                setUserInputs((prev) => {
                  return { ...prev, password: e.target.value };
                })
              }
            />
          </div>
          <div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Submiting" : "Create Account"}
            </button>
          </div>
        </Form>
      </Formik>
      {isError && error && <h2>{error.data.message}</h2>}
    </>
  );
};

export default SignupForm;
