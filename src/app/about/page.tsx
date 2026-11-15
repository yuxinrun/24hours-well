import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ClockIllustration, DayJourneyIllustration } from '@/components/illustrations';
import { ShieldCheck, BookOpenCheck, HeartHandshake, Compass } from 'lucide-react';

export const metadata: Metadata = {
  title: '关于我们',
  description: '了解「好好度过24小时」的创办理念、内容原则与资源声明。一个关于时间、精力与生活的知识型内容平台。',
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="关于「好好度过24小时」"
        description="每个人每天都拥有 24 小时。如何理解时间、安排时间、保护注意力、管理精力，并把时间投入真正重要的事情，是一门值得持续研究和实践的学问。"
        breadcrumb={[{ label: '关于我们' }]}
      />

      <section className="container-site py-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <h2 className="section-title mb-5">我们相信什么</h2>
            <div className="space-y-5 text-[15px] leading-[1.95] text-ink-soft">
              <p>
                时间管理不是把每一分钟都用满，也不是盲目追求效率。它是一场持续的练习：认识自己的精力节律，理解注意力的稀缺，学会取舍，然后认真地把时间投入真正重要的事。
              </p>
              <p>
                「好好度过24小时」希望成为一个有专业编辑品质的内容平台——不是鸡汤博客，也不是工具集合，而是把<strong className="text-ink">知识、方法、工具与思考</strong>结合在一起的地方。你可以在这里读一篇有依据的深度文章，系统学习一种方法，找到一本值得读的书，或者打开一个工具，立刻开始审视自己的时间。
              </p>
              <p className="font-serif text-lg italic text-caramel-600">Make Every Hour Count. — 让每一个小时都算数。</p>
            </div>
          </div>
          <div className="card-base flex items-center justify-center bg-paper-100/60 p-10">
            <ClockIllustration className="max-w-[260px]" />
          </div>
        </div>
      </section>

      <section className="border-y border-paper-200 bg-paper-100/60 py-14">
        <div className="container-site">
          <SectionHeading eyebrow="Our Principles" title="内容原则" description="我们如何对待这里的每一篇文章、每一条信息。" />
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              { icon: BookOpenCheck, title: '有依据，不杜撰', desc: '书籍的作者、出版信息以公开资料为准；引用会标注作者与作品。无法确认出处的句子，明确标注为编辑原创，绝不伪装成名人名言。' },
              { icon: Compass, title: '务实，能落地', desc: '每篇文章都力求回答三个问题：今天可以做什么、明天如何改进、下周如何复盘。拒绝空洞的励志与重复凑篇幅。' },
              { icon: ShieldCheck, title: '尊重隐私', desc: '时间实验室的所有个人数据默认只保存在你的浏览器 localStorage 中，不会上传到任何服务器。演示数据会明确标注。' },
              { icon: HeartHandshake, title: '克制而真诚', desc: '我们不用夸张的承诺和焦虑营销。方法只是参考，建议不是定论，真正的答案在你自己的生活实践中。' },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="card-base p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-caramel-100 text-caramel-600"><Icon className="h-5 w-5" /></span>
                  <h3 className="mt-4 font-serif text-lg font-bold text-ink">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-site py-14" id="principles">
        <div className="card-base paper-texture p-8 sm:p-12">
          <p className="eyebrow mb-4">A Day, Well Lived</p>
          <DayJourneyIllustration />
          <p className="mt-8 text-center font-serif text-base leading-relaxed text-ink-muted">
            从清晨到夜晚，时间不是敌人，而是我们唯一真正拥有的东西。如何度过它，定义了我们是谁。
          </p>
        </div>
      </section>

      <section className="container-site pb-10" id="disclaimer">
        <div className="card-base p-7">
          <h2 className="font-serif text-xl font-bold text-ink">资源声明与版权</h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-muted">
            <p>本站文章参考公开出版的书籍与学术资料整理，力求准确并标注来源，但不构成医疗、心理或财务等专业建议。</p>
            <p>书籍信息以官方出版资料为准；网站名称与链接真实有效，但网站内容由第三方维护，可能随时间变化。</p>
            <p>Hero 与文章配图来自 Unsplash 等公开图库；若图片加载失败，页面会自动显示本地 SVG 占位，不影响布局与阅读。</p>
            <p>站点内容版权归本站所有，转载请注明出处。如有信息勘误或合作建议，欢迎通过页面反馈渠道联系。</p>
          </div>
          <Link href="/articles" className="btn-outline mt-6">开始阅读 <span>→</span></Link>
        </div>
      </section>
    </>
  );
}
