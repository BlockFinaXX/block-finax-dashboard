// app/register/page.tsx
import RegisterForm from "../../components/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="max-w-md mx-auto mt-24 bg-white p-6 rounded-lg shadow-md">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
