"use client";
import { useState } from "react";
import Link from "next/link";
import { databases, availablePlatforms } from "@/lib/platforms";
import {
  buildDatabaseSetupTask,
  buildDatabaseDiagnostic,
  databaseSymptoms,
  type DatabaseSymptom,
  type DatabaseTaskContext,
} from "@/lib/database-tasks";
import { CopyButton } from "@/components/copy-button";
import { AnimatedDisclosure } from "@/components/animated-disclosure";

export function DatabaseTaskPanel({
  selectedId,
  context,
  onSelect,
  onChange,
}: {
  selectedId: string;
  context: DatabaseTaskContext;
  onSelect: (id: string) => void;
  onChange: (context: DatabaseTaskContext) => void;
}) {
  const [symptom, setSymptom] = useState<DatabaseSymptom>("unknown");
  const [operation, setOperation] = useState("");
  const [error, setError] = useState("");
  const service = databases.find((item) => item.id === selectedId);
  const setup = buildDatabaseSetupTask(service, context);
  const diagnostic = buildDatabaseDiagnostic(
    context,
    service,
    symptom,
    operation,
    error,
  );
  return (
    <div className="database-task-panel">
      <section id="database-connect" className="database-task-section">
        <h3>选好后，让 AI 带你接到项目里</h3>
        <p>
          DATABASE_URL 是某些数据库的连接信息，通常包含密码。D1
          用绑定，Firebase、云开发有自己的配置方式；不用在这里填写任何秘密值。
        </p>
        <div className="database-form-grid">
          <div>
            <label htmlFor="data-service">这次接入或排查哪个服务？</label>
            <select
              id="data-service"
              className="tool-input"
              value={selectedId}
              onChange={(event) => onSelect(event.target.value)}
            >
              <option value="unknown">还不确定，让 AI 从项目识别</option>
              {databases.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="data-stage">这次处理到哪一步？</label>
            <select
              id="data-stage"
              className="tool-input"
              value={context.stage}
              onChange={(event) =>
                onChange({
                  ...context,
                  stage: event.target.value as DatabaseTaskContext["stage"],
                })
              }
            >
              <option value="local">先在电脑上接通</option>
              <option value="online">网站已部署，处理线上环境</option>
              <option value="both">本地接通后，再配置线上</option>
            </select>
          </div>
          <div>
            <label htmlFor="data-deployment">
              网站准备部署 / 已部署到哪里？
            </label>
            <select
              id="data-deployment"
              className="tool-input"
              value={context.deploymentId}
              onChange={(event) =>
                onChange({ ...context, deploymentId: event.target.value })
              }
            >
              <option value="unknown">还没选 / 不在列表中</option>
              {availablePlatforms.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {service && (
          <p className="database-task-selection">
            <strong>接入 {service.name}：</strong>
            {service.setupHint}
          </p>
        )}
        <div className="database-task-action">
          <CopyButton text={setup} label="复制我的接入说明" />
        </div>
        <p className="database-help">
          把说明粘贴给已打开项目的 AI
          编程助手。它会结合上面的用途、已有数据库和本次选择，告诉你去哪里、填什么、怎样验证；遇到类型冲突先解释，不直接换库。
        </p>
        <AnimatedDisclosure title="复制前看看完整说明">
          <pre className="database-task-preview">{setup}</pre>
        </AnimatedDisclosure>
        <details className="database-verification">
          <summary>怎样才算接好了？</summary>
          <ol>
            <li>提交一条测试记录或文件，再刷新，仍能读到。</li>
            <li>私人内容只有有权限的账号能看到，退出登录后不能绕过。</li>
            <li>重新部署或重启后数据仍在；上线时再验证一次相同操作。</li>
          </ol>
          <p>只看见“连接成功”或网页能打开，还不代表保存与权限正确。</p>
          <Link href="/guide/cloud">接通了，继续选择网站部署平台</Link>
        </details>
      </section>
      <section id="database-troubleshoot" className="database-task-section">
        <h3>保存失败、文件丢了，或本地能连上线不行？</h3>
        <p>
          沿用上方所选的服务、环境和部署位置，补充实际现象。输入仅用于本页生成待复制的说明，不保存或提交；先去掉密码、密钥和个人信息。
        </p>
        <label htmlFor="data-symptom">我遇到的情况</label>
        <select
          id="data-symptom"
          className="tool-input"
          value={symptom}
          onChange={(event) =>
            setSymptom(event.target.value as DatabaseSymptom)
          }
        >
          {databaseSymptoms.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <p className="database-task-selection">
          {databaseSymptoms.find((item) => item.value === symptom)!.check}
        </p>
        <details className="database-error-details">
          <summary>补充失败操作和报错（选填）</summary>
          <label htmlFor="data-operation">点了什么 / 执行了什么？</label>
          <input
            id="data-operation"
            className="tool-input"
            value={operation}
            maxLength={1000}
            onChange={(event) => setOperation(event.target.value)}
            placeholder="例如：在已上线的报名页面点击提交"
          />
          <label htmlFor="data-error">已经去掉秘密信息的报错</label>
          <textarea
            id="data-error"
            className="tool-input"
            rows={4}
            maxLength={12000}
            value={error}
            onChange={(event) => setError(event.target.value)}
            placeholder="粘贴相关错误；没有日志也可以留空，AI 会先帮你定位"
          />
        </details>
        <div className="database-task-action">
          <CopyButton text={diagnostic} label="复制我的排错说明" />
        </div>
      </section>
    </div>
  );
}
