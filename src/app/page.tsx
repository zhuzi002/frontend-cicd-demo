import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { readBuildInfo } from "@/lib/build-info";
import { pipelineStages } from "@/lib/stages";

export default function HomePage() {
  const info = readBuildInfo({
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
    NEXT_PUBLIC_GIT_SHA: process.env.NEXT_PUBLIC_GIT_SHA,
    NEXT_PUBLIC_BUILD_TIME: process.env.NEXT_PUBLIC_BUILD_TIME,
  });

  return (
    <div className="space-y-10">
      <section className="max-w-3xl">
        <p className="text-sm tracking-[0.22em] text-muted-foreground">
          本地发布台
        </p>
        <h1 className="mt-3 font-heading text-4xl leading-tight sm:text-5xl">
          这一版，从检查走到容器里。
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          栈桥把一次前端发布拆成能在自己机器上看完的几步：代码检查、单元测试、打镜像、换上容器，再请求健康检查。推到
          Gitee 之前，先在这里走通。
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Fact label="版本" value={info.version} />
        <Fact label="提交" value={info.commit} />
        <Fact label="构建时间" value={info.builtAt} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>在本机走完全流程</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-6">
          <p className="text-muted-foreground">
            开发服务器只负责改页面。要打出和流水线一样的镜像，在项目根目录运行：
          </p>
          <pre className="overflow-x-auto rounded-lg bg-[oklch(0.28_0.04_242)] px-4 py-3 font-mono text-sm text-[oklch(0.96_0.012_88)]">
            npm run pipeline
          </pre>
          <p className="text-muted-foreground">
            需要本机已经装好 Docker，并且
            <code className="mx-1 inline-block rounded bg-muted px-1.5 py-0.5 font-mono whitespace-nowrap text-foreground">
              docker compose version
            </code>
            能运行。完成后打开
            <code className="mx-1 inline-block rounded bg-muted px-1.5 py-0.5 font-mono whitespace-nowrap text-foreground">
              http://127.0.0.1:41821
            </code>
            。开发时继续用
            <code className="mx-1 inline-block rounded bg-muted px-1.5 py-0.5 font-mono whitespace-nowrap text-foreground">
              npm run dev
            </code>
            ，端口是 43123。
          </p>
        </CardContent>
      </Card>

      <section>
        <h2 className="font-heading text-2xl">流水线里的六步</h2>
        <ol className="mt-4 space-y-3">
          {pipelineStages.map((stage, index) => (
            <li key={stage.id}>
              <Card size="sm">
                <CardContent className="flex gap-4">
                  <span className="font-heading text-2xl text-[oklch(0.58_0.08_75)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-medium">{stage.name}</h3>
                    <p className="mt-1 font-mono text-xs text-foreground/80">
                      {stage.command}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {stage.detail}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="break-all font-heading text-2xl">{value}</p>
      </CardContent>
    </Card>
  );
}
