import "./globals.css";

export const metadata = {
  title: "SmartERP",
  description: "Smart ERP System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}