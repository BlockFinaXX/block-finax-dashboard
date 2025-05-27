// app/login/layout.tsx
const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="bg-gray-100 flex items-center justify-center min-h-screen">
        {children}
      </body>
    </html>
  );
};

export default LoginLayout;
