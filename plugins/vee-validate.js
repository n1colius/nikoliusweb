import { extend, configure } from "vee-validate";
import { required, alpha, email } from "vee-validate/dist/rules";

extend("required", {
  ...required,
  message: "This field is required"
});

extend("email", {
    ...email,
    message: "Email address not valid"
});

extend("alpha", {
  ...alpha,
  message: "This field must only contain alphabetic characters"
});

// Install classes
configure({
    classes: {
      valid: 'input is-valid',
      invalid: 'input is-danger'
    }
})