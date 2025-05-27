// app/login/page.tsx
import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="max-w-md mx-auto mt-24 bg-white p-6 rounded-lg shadow-md ">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
