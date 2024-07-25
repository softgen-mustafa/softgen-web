
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-[96vw]" >
        <div >
          {children}
        </div>
    </div>
  );
}
