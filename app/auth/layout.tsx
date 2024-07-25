
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-[96vw]" >
    {/* <html lang="en">
      <body> */}
        <h1>Auth Layout</h1>
        <div >
          {children}
        </div>
        {/* </body>
    </html> */}
    </div>
  );
}
