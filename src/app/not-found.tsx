import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="font-heading text-4xl">没有这一页</h1>
      <p className="mt-3 leading-7 text-muted-foreground">
        地址可能写错了。概览、发布记录和上线检查单都从首页进。
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-8 items-center rounded-lg bg-primary px-3 text-sm text-primary-foreground"
      >
        回到概览
      </Link>
    </div>
  );
}
