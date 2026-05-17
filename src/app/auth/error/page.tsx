import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <main className="auth-error">
      <div>
        <p className="eyebrow">登录失败</p>
        <h1>没有完成 Vercel 登录</h1>
        <p>请确认 OAuth 回调地址、Client ID、Client Secret 和数据库环境变量已经配置。</p>
        <Link href="/">返回首页</Link>
      </div>
    </main>
  );
}
