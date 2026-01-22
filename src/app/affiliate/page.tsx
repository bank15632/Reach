"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import { ChevronDown, Users, Gift, DollarSign, TrendingUp, CheckCircle, Star, UserPlus } from "lucide-react";

// How It Works Step Component
function StepCard({ number, title, description, icon }: { number: number; title: string; description: string; icon: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: number * 0.1 }}
            className="relative bg-white p-6 rounded-lg border border-gray-200 hover:border-brand-yellow transition-colors"
        >
            <div className="absolute -top-4 left-6 w-8 h-8 bg-brand-yellow text-black rounded-full flex items-center justify-center font-bold text-sm">
                {number}
            </div>
            <div className="mt-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    {icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{description}</p>
            </div>
        </motion.div>
    );
}

// Benefit Card Component
function BenefitCard({ title, description, icon, highlight }: { title: string; description: string; icon: React.ReactNode; highlight?: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`p-6 rounded-lg ${highlight ? 'bg-brand-yellow text-black' : 'bg-gray-900 text-white'}`}
        >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${highlight ? 'bg-black/10' : 'bg-white/10'}`}>
                {icon}
            </div>
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className={`text-sm ${highlight ? 'text-black/70' : 'text-gray-400'}`}>{description}</p>
        </motion.div>
    );
}

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
                <span className="font-medium text-gray-900">{question}</span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="pb-4 text-gray-600 text-sm"
                >
                    {answer}
                </motion.div>
            )}
        </div>
    );
}

// Commission Tier Component
function CommissionTier({ tier, commission, sales, current }: { tier: string; commission: string; sales: string; current?: boolean }) {
    return (
        <div className={`p-4 rounded-lg border-2 ${current ? 'border-brand-yellow bg-brand-yellow/5' : 'border-gray-200'}`}>
            {current && (
                <span className="inline-block px-2 py-0.5 bg-brand-yellow text-black text-xs font-bold rounded mb-2">
                    STARTER
                </span>
            )}
            <h4 className="text-lg font-bold text-gray-900">{tier}</h4>
            <p className="text-3xl font-bold text-brand-yellow mt-2">{commission}</p>
            <p className="text-sm text-gray-500 mt-1">{sales}</p>
        </div>
    );
}

export default function AffiliatePage() {
    const { language } = useLanguage();
    const { isLoggedIn } = useUser();

    const content = {
        en: {
            hero: {
                title: 'PARTNER WITH REACH',
                subtitle: 'Join our affiliate program and earn commissions while helping your audience save on premium badminton gear',
            },
            notice: {
                title: 'How to Become a Partner',
                description: 'To apply for our affiliate program, you need to create a REACH member account first. Once registered, you can apply to become a partner from your Profile page.',
                cta: 'Register / Login'
            },
            howItWorks: {
                title: 'How It Works',
                steps: [
                    { title: 'Create Account', description: 'Register as a REACH member first. This is required to apply for the affiliate program.' },
                    { title: 'Apply from Profile', description: 'Go to your Profile page and click "Apply to be a Partner" to submit your application.' },
                    { title: 'Get Approved', description: 'We review all applications within 48 hours. You\'ll receive your unique affiliate code once approved.' },
                    { title: 'Share & Earn', description: 'Share your code with your audience. They get discounts, you earn commissions on every sale.' }
                ]
            },
            benefits: {
                title: 'Program Benefits',
                forAffiliates: {
                    title: 'For Partners',
                    items: [
                        { title: 'Up to 15% Commission', description: 'Earn competitive commissions on every sale made with your code' },
                        { title: 'Real-time Dashboard', description: 'Track clicks, conversions, and earnings in real-time' },
                        { title: 'Monthly Payouts', description: 'Reliable monthly payments directly to your bank account' },
                        { title: 'Exclusive Access', description: 'Early access to new products and special promotions' }
                    ]
                },
                forCustomers: {
                    title: 'For Your Audience',
                    items: [
                        { title: '10% Discount', description: 'Your followers get exclusive savings on all purchases' },
                        { title: 'Free Shipping', description: 'Orders over ฿2,000 qualify for free shipping' },
                        { title: 'Quality Products', description: 'Premium badminton equipment trusted by pros' }
                    ]
                }
            },
            commission: {
                title: 'Commission Structure',
                tiers: [
                    { tier: 'Bronze', commission: '10%', sales: '฿0 - ฿50,000/month' },
                    { tier: 'Silver', commission: '12%', sales: '฿50,001 - ฿150,000/month' },
                    { tier: 'Gold', commission: '15%', sales: '฿150,001+/month' }
                ]
            },
            terms: {
                title: 'Terms & Conditions',
                items: [
                    'You must be at least 18 years old to participate in the affiliate program.',
                    'Affiliate commissions are paid monthly, with a minimum payout threshold of ฿1,000.',
                    'Commissions are calculated based on the net sale amount (excluding shipping and taxes).',
                    'Self-referrals or fraudulent activities will result in immediate termination.',
                    'REACH reserves the right to modify commission rates with 30 days notice.',
                    'Affiliates must not use paid advertising that directly competes with REACH\'s ads.',
                    'Cookie duration is 30 days - you earn commission on purchases within this window.',
                    'Payments are processed on the 1st of each month for the previous month\'s earnings.',
                ]
            },
            faq: {
                title: 'Frequently Asked Questions',
                items: [
                    { q: 'Who can become a REACH partner?', a: 'Anyone with an active social media presence or audience interested in badminton can apply. We welcome players, coaches, content creators, and enthusiasts.' },
                    { q: 'How long does approval take?', a: 'We review all applications within 48 hours. You\'ll receive an email notification once your application is reviewed.' },
                    { q: 'How do I track my earnings?', a: 'Once approved, you\'ll see a new "Partner Dashboard" section in your Profile where you can track clicks, conversions, and earnings in real-time.' },
                    { q: 'When and how do I get paid?', a: 'Earnings are paid monthly via bank transfer. Minimum payout is ฿1,000. Payments are processed on the 1st of each month.' },
                    { q: 'Can I use my own affiliate code?', a: 'Yes! You can request a custom code (subject to availability) when applying. Your followers will remember it easier.' }
                ]
            }
        },
        th: {
            hero: {
                title: 'ร่วมงานกับ REACH',
                subtitle: 'เข้าร่วมโปรแกรมพาร์ทเนอร์ของเราและรับค่าคอมมิชชั่น พร้อมช่วยให้ผู้ติดตามของคุณประหยัดเมื่อซื้ออุปกรณ์แบดมินตัน',
            },
            notice: {
                title: 'วิธีสมัครเป็นพาร์ทเนอร์',
                description: 'ในการสมัครโปรแกรมพาร์ทเนอร์ คุณต้องสมัครสมาชิก REACH ก่อน เมื่อลงทะเบียนแล้ว คุณสามารถสมัครเป็นพาร์ทเนอร์ได้จากหน้า Profile ของคุณ',
                cta: 'สมัครสมาชิก / เข้าสู่ระบบ'
            },
            howItWorks: {
                title: 'วิธีการทำงาน',
                steps: [
                    { title: 'สร้างบัญชี', description: 'สมัครสมาชิก REACH ก่อน นี่เป็นข้อบังคับในการสมัครโปรแกรมพาร์ทเนอร์' },
                    { title: 'สมัครจาก Profile', description: 'ไปที่หน้า Profile ของคุณและคลิก "สมัครเป็นพาร์ทเนอร์" เพื่อส่งใบสมัคร' },
                    { title: 'รอการอนุมัติ', description: 'เราจะพิจารณาใบสมัครภายใน 48 ชั่วโมง คุณจะได้รับโค้ด affiliate เมื่อได้รับการอนุมัติ' },
                    { title: 'แชร์และรับเงิน', description: 'แชร์โค้ดของคุณให้ผู้ติดตาม พวกเขาได้ส่วนลด คุณได้ค่าคอมมิชชั่นทุกยอดขาย' }
                ]
            },
            benefits: {
                title: 'สิทธิประโยชน์ของโปรแกรม',
                forAffiliates: {
                    title: 'สำหรับพาร์ทเนอร์',
                    items: [
                        { title: 'คอมมิชชั่นสูงสุด 15%', description: 'รับค่าคอมมิชชั่นที่แข่งขันได้ทุกยอดขายจากโค้ดของคุณ' },
                        { title: 'Dashboard แบบเรียลไทม์', description: 'ติดตามการคลิก การซื้อ และรายได้แบบเรียลไทม์' },
                        { title: 'จ่ายเงินทุกเดือน', description: 'การจ่ายเงินที่เชื่อถือได้ตรงเข้าบัญชีธนาคารของคุณ' },
                        { title: 'สิทธิพิเศษ', description: 'เข้าถึงสินค้าใหม่และโปรโมชั่นพิเศษก่อนใคร' }
                    ]
                },
                forCustomers: {
                    title: 'สำหรับผู้ติดตามของคุณ',
                    items: [
                        { title: 'ส่วนลด 10%', description: 'ผู้ติดตามของคุณได้รับส่วนลดพิเศษทุกการสั่งซื้อ' },
                        { title: 'ส่งฟรี', description: 'คำสั่งซื้อเกิน ฿2,000 ส่งฟรีทั่วประเทศ' },
                        { title: 'สินค้าคุณภาพ', description: 'อุปกรณ์แบดมินตันระดับพรีเมียมที่มือโปรไว้วางใจ' }
                    ]
                }
            },
            commission: {
                title: 'โครงสร้างค่าคอมมิชชั่น',
                tiers: [
                    { tier: 'Bronze', commission: '10%', sales: '฿0 - ฿50,000/เดือน' },
                    { tier: 'Silver', commission: '12%', sales: '฿50,001 - ฿150,000/เดือน' },
                    { tier: 'Gold', commission: '15%', sales: '฿150,001+/เดือน' }
                ]
            },
            terms: {
                title: 'ข้อกำหนดและเงื่อนไข',
                items: [
                    'คุณต้องมีอายุอย่างน้อย 18 ปีขึ้นไปเพื่อเข้าร่วมโปรแกรมพาร์ทเนอร์',
                    'ค่าคอมมิชชั่นจะจ่ายทุกเดือน โดยมียอดขั้นต่ำในการถอน ฿1,000',
                    'ค่าคอมมิชชั่นคำนวณจากยอดขายสุทธิ (ไม่รวมค่าจัดส่งและภาษี)',
                    'การอ้างอิงตัวเองหรือกิจกรรมฉ้อโกงจะส่งผลให้ถูกยกเลิกทันที',
                    'REACH สงวนสิทธิ์ในการปรับเปลี่ยนอัตราค่าคอมมิชชั่นโดยแจ้งล่วงหน้า 30 วัน',
                    'พาร์ทเนอร์ต้องไม่ใช้โฆษณาแบบชำระเงินที่แข่งขันกับโฆษณาของ REACH โดยตรง',
                    'ระยะเวลา Cookie คือ 30 วัน - คุณจะได้รับค่าคอมมิชชั่นจากการซื้อภายในช่วงเวลานี้',
                    'การชำระเงินจะดำเนินการในวันที่ 1 ของทุกเดือนสำหรับรายได้ของเดือนก่อนหน้า',
                ]
            },
            faq: {
                title: 'คำถามที่พบบ่อย',
                items: [
                    { q: 'ใครสามารถเป็นพาร์ทเนอร์ REACH ได้?', a: 'ใครก็ตามที่มีโซเชียลมีเดียหรือผู้ติดตามที่สนใจแบดมินตันสามารถสมัครได้ เรายินดีต้อนรับนักกีฬา โค้ช ครีเอเตอร์ และผู้รักแบดมินตันทุกคน' },
                    { q: 'การอนุมัติใช้เวลานานเท่าไหร่?', a: 'เราพิจารณาใบสมัครทุกใบภายใน 48 ชั่วโมง คุณจะได้รับอีเมลแจ้งเตือนเมื่อใบสมัครของคุณได้รับการพิจารณา' },
                    { q: 'ติดตามรายได้ได้อย่างไร?', a: 'เมื่อได้รับการอนุมัติ คุณจะเห็นส่วน "Partner Dashboard" ใหม่ใน Profile ที่สามารถติดตามการคลิก การซื้อ และรายได้แบบเรียลไทม์' },
                    { q: 'ได้รับเงินเมื่อไหร่และอย่างไร?', a: 'รายได้จะจ่ายทุกเดือนผ่านการโอนเงิน ขั้นต่ำในการถอนคือ ฿1,000 การจ่ายเงินจะดำเนินการในวันที่ 1 ของทุกเดือน' },
                    { q: 'สามารถใช้โค้ดที่กำหนดเองได้ไหม?', a: 'ได้! คุณสามารถขอโค้ดที่กำหนดเองได้ (ขึ้นอยู่กับความพร้อม) เมื่อสมัคร ผู้ติดตามของคุณจะจำได้ง่ายขึ้น' }
                ]
            }
        }
    };

    const t = language === 'th' ? content.th : content.en;

    return (
        <main className="bg-white min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-24 pb-16 bg-brand-black">
                <div className="max-w-7xl mx-auto px-6">
                    <Breadcrumb items={[{ label: 'PARTNER', labelTh: 'ร่วมงานกับเรา' }]} />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            {t.hero.title}
                        </h1>
                        <p className="text-gray-400 text-lg">
                            {t.hero.subtitle}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Notice Section - How to Apply */}
            <section className="py-12 bg-brand-yellow">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <UserPlus className="w-16 h-16 text-black mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-black mb-4">
                        {t.notice.title}
                    </h2>
                    <p className="text-black/70 text-lg mb-6">
                        {t.notice.description}
                    </p>
                    {isLoggedIn ? (
                        <Link
                            href="/affiliate/register"
                            className="inline-block bg-black text-white px-8 py-3 font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
                        >
                            {language === "th" ? "สมัครเป็นพาร์ทเนอร์" : "Apply Now"}
                        </Link>
                    ) : (
                        <a
                            href="/login"
                            className="inline-block bg-black text-white px-8 py-3 font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
                        >
                            {t.notice.cta}
                        </a>
                    )}
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        {t.howItWorks.title}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {t.howItWorks.steps.map((step, index) => (
                            <StepCard
                                key={index}
                                number={index + 1}
                                title={step.title}
                                description={step.description}
                                icon={
                                    index === 0 ? <UserPlus className="w-6 h-6 text-gray-700" /> :
                                        index === 1 ? <Users className="w-6 h-6 text-gray-700" /> :
                                            index === 2 ? <Gift className="w-6 h-6 text-gray-700" /> :
                                                <DollarSign className="w-6 h-6 text-gray-700" />
                                }
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        {t.benefits.title}
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* For Affiliates */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Star className="w-5 h-5 text-brand-yellow" />
                                {t.benefits.forAffiliates.title}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {t.benefits.forAffiliates.items.map((item, index) => (
                                    <BenefitCard
                                        key={index}
                                        title={item.title}
                                        description={item.description}
                                        icon={<DollarSign className="w-6 h-6" />}
                                        highlight={index === 0}
                                    />
                                ))}
                            </div>
                        </div>
                        {/* For Customers */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Gift className="w-5 h-5 text-brand-yellow" />
                                {t.benefits.forCustomers.title}
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                {t.benefits.forCustomers.items.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-gray-900">{item.title}</h4>
                                            <p className="text-sm text-gray-600">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Commission Structure */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        {t.commission.title}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        {t.commission.tiers.map((tier, index) => (
                            <CommissionTier
                                key={index}
                                tier={tier.tier}
                                commission={tier.commission}
                                sales={tier.sales}
                                current={index === 0}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Terms & Conditions */}
            <section className="py-16">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                        {t.terms.title}
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-6">
                        <ul className="space-y-4">
                            {t.terms.items.map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                        {index + 1}
                                    </span>
                                    <span className="text-gray-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        {t.faq.title}
                    </h2>
                    <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                        {t.faq.items.map((item, index) => (
                            <FAQItem key={index} question={item.q} answer={item.a} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-16 bg-brand-black">
                <div className="max-w-2xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        {language === 'th' ? 'พร้อมเริ่มต้นหรือยัง?' : 'Ready to Get Started?'}
                    </h2>
                    <p className="text-gray-400 mb-8">
                        {isLoggedIn
                            ? (language === 'th' ? 'คุณพร้อมสมัครเป็นพาร์ทเนอร์แล้ว!' : 'You\'re ready to apply as a partner!')
                            : (language === 'th'
                                ? 'สมัครสมาชิกตอนนี้และสมัครเป็นพาร์ทเนอร์จากหน้า Profile ของคุณ'
                                : 'Create your account now and apply to become a partner from your Profile page.')
                        }
                    </p>
                    {isLoggedIn ? (
                        <Link
                            href="/affiliate/register"
                            className="inline-block bg-brand-yellow text-black px-8 py-4 font-bold uppercase tracking-wide hover:bg-yellow-400 transition-colors"
                        >
                            {language === "th" ? "สมัครเป็นพาร์ทเนอร์" : "Apply Now"}
                        </Link>
                    ) : (
                        <a
                            href="/login"
                            className="inline-block bg-brand-yellow text-black px-8 py-4 font-bold uppercase tracking-wide hover:bg-yellow-400 transition-colors"
                        >
                            {t.notice.cta}
                        </a>
                    )}
                </div>
            </section>
        </main>
    );
}
