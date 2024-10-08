import { Redirect } from "expo-router";

export default function Index() {
  // Điều hướng người dùng đến LoginScreen mặc định khi mở app
  return <Redirect href="/login" />;
}