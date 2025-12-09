'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SettingsFormProps {
  settings: any
}

export function SettingsForm({ settings: initialSettings }: SettingsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    businessName: initialSettings.businessName || '',
    logoUrl: initialSettings.logoUrl || '',
    primaryColor: initialSettings.primaryColor || '#111827',
    secondaryColor: initialSettings.secondaryColor || '#f3f4f6',
    siteTitle: initialSettings.siteTitle || '',
    metaDescription: initialSettings.metaDescription || '',
    ogTitle: initialSettings.ogTitle || '',
    ogDescription: initialSettings.ogDescription || '',
    ogImageUrl: initialSettings.ogImageUrl || '',
    twitterCardType: initialSettings.twitterCardType || 'summary_large_image',
    canonicalUrl: initialSettings.canonicalUrl || '',
    faviconUrl: initialSettings.faviconUrl || '',
    appleTouchIconUrl: initialSettings.appleTouchIconUrl || '',
    themeColor: initialSettings.themeColor || '#111827',
    robotsIndex: initialSettings.robotsIndex ?? true,
    robotsFollow: initialSettings.robotsFollow ?? true,
    googleAnalyticsId: initialSettings.googleAnalyticsId || '',
    googleTagManagerId: initialSettings.googleTagManagerId || '',
    facebookVerification: initialSettings.facebookVerification || '',
    pinterestVerification: initialSettings.pinterestVerification || '',
    businessEmail: initialSettings.businessEmail || '',
    businessPhone: initialSettings.businessPhone || '',
    businessAddress: initialSettings.businessAddress || '',
    businessCity: initialSettings.businessCity || '',
    businessState: initialSettings.businessState || '',
    businessZip: initialSettings.businessZip || '',
    businessCountry: initialSettings.businessCountry || '',
    aboutText: initialSettings.aboutText || '',
    heroHeadline: initialSettings.heroHeadline || '',
    heroSubheadline: initialSettings.heroSubheadline || '',
    heroImageUrl: initialSettings.heroImageUrl || '',
    openingHours: initialSettings.openingHours || '',
    facebookUrl: initialSettings.facebookUrl || '',
    instagramUrl: initialSettings.instagramUrl || '',
    twitterUrl: initialSettings.twitterUrl || '',
    tiktokUrl: initialSettings.tiktokUrl || '',
    mapEmbedHtml: initialSettings.mapEmbedHtml || '',
    showHomepage: initialSettings.showHomepage ?? true,
    showProductList: initialSettings.showProductList ?? true,
    showSearch: initialSettings.showSearch ?? true,
    showAccountArea: initialSettings.showAccountArea ?? true,
    showContactPage: initialSettings.showContactPage ?? true,
    showLocationPage: initialSettings.showLocationPage ?? true,
    showBlog: initialSettings.showBlog ?? true,
    showFAQ: initialSettings.showFAQ ?? true,
    shippingMode: initialSettings.shippingMode || 'flat',
    flatShippingRateCents: initialSettings.flatShippingRateCents || 0,
    flatShippingLabel: initialSettings.flatShippingLabel || 'Standard Shipping',
    stripeSecretKey: initialSettings.stripeSecretKey || '',
    stripePublishableKey: initialSettings.stripePublishableKey || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.refresh()
        alert('Settings saved successfully!')
      } else {
        alert('Error saving settings')
      }
    } catch (error) {
      alert('Error saving settings')
    } finally {
      setLoading(false)
    }
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Business Identity */}
      <section className="border rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Business Identity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-semibold">Business Name</label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Logo URL</label>
            <input
              type="url"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Primary Color</label>
            <input
              type="color"
              value={formData.primaryColor}
              onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
              className="w-full h-10 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Secondary Color</label>
            <input
              type="color"
              value={formData.secondaryColor}
              onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
              className="w-full h-10 border rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* SEO & Branding */}
      <section className="border rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">SEO & Branding</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-semibold">Site Title</label>
            <input
              type="text"
              value={formData.siteTitle}
              onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Meta Description</label>
            <textarea
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Open Graph Title</label>
            <input
              type="text"
              value={formData.ogTitle}
              onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Open Graph Description</label>
            <textarea
              value={formData.ogDescription}
              onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Open Graph Image URL</label>
            <input
              type="url"
              value={formData.ogImageUrl}
              onChange={(e) => setFormData({ ...formData, ogImageUrl: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Canonical URL</label>
            <input
              type="url"
              value={formData.canonicalUrl}
              onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="https://yourdomain.com"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Favicon URL</label>
            <input
              type="url"
              value={formData.faviconUrl}
              onChange={(e) => setFormData({ ...formData, faviconUrl: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Apple Touch Icon URL</label>
            <input
              type="url"
              value={formData.appleTouchIconUrl}
              onChange={(e) => setFormData({ ...formData, appleTouchIconUrl: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Theme Color</label>
            <input
              type="color"
              value={formData.themeColor}
              onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
              className="w-full h-10 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Twitter Card Type</label>
            <select
              value={formData.twitterCardType}
              onChange={(e) => setFormData({ ...formData, twitterCardType: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="summary">summary</option>
              <option value="summary_large_image">summary_large_image</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="block font-semibold">Robots</label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.robotsIndex}
                onChange={(e) => setFormData({ ...formData, robotsIndex: e.target.checked })}
              />
              Allow indexing (index)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.robotsFollow}
                onChange={(e) => setFormData({ ...formData, robotsFollow: e.target.checked })}
              />
              Allow following links (follow)
            </label>
          </div>
          <div>
            <label className="block mb-2 font-semibold">Google Analytics ID</label>
            <input
              type="text"
              value={formData.googleAnalyticsId}
              onChange={(e) => setFormData({ ...formData, googleAnalyticsId: e.target.value })}
              placeholder="G-XXXXXXX"
              className="w-full px-4 py-2 border rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Google Tag Manager ID</label>
            <input
              type="text"
              value={formData.googleTagManagerId}
              onChange={(e) => setFormData({ ...formData, googleTagManagerId: e.target.value })}
              placeholder="GTM-XXXXXXX"
              className="w-full px-4 py-2 border rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Facebook Verification</label>
            <input
              type="text"
              value={formData.facebookVerification}
              onChange={(e) => setFormData({ ...formData, facebookVerification: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Facebook domain verification code"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Pinterest Verification</label>
            <input
              type="text"
              value={formData.pinterestVerification}
              onChange={(e) => setFormData({ ...formData, pinterestVerification: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Pinterest verification code"
            />
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="border rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-semibold">Email</label>
            <input
              type="email"
              value={formData.businessEmail}
              onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Phone</label>
            <input
              type="tel"
              value={formData.businessPhone}
              onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Address</label>
            <input
              type="text"
              value={formData.businessAddress}
              onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">City</label>
            <input
              type="text"
              value={formData.businessCity}
              onChange={(e) => setFormData({ ...formData, businessCity: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">State</label>
            <input
              type="text"
              value={formData.businessState}
              onChange={(e) => setFormData({ ...formData, businessState: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">ZIP Code</label>
            <input
              type="text"
              value={formData.businessZip}
              onChange={(e) => setFormData({ ...formData, businessZip: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Country</label>
            <input
              type="text"
              value={formData.businessCountry}
              onChange={(e) => setFormData({ ...formData, businessCountry: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* About & Hero */}
      <section className="border rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">About & Hero Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-semibold">About Text</label>
            <textarea
              value={formData.aboutText}
              onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Hero Headline</label>
            <input
              type="text"
              value={formData.heroHeadline}
              onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Hero Subheadline</label>
            <input
              type="text"
              value={formData.heroSubheadline}
              onChange={(e) => setFormData({ ...formData, heroSubheadline: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Hero Image URL</label>
            <input
              type="url"
              value={formData.heroImageUrl}
              onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Store Hours */}
      <section className="border rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Store Hours</h2>
        <div>
          <label className="block mb-2 font-semibold">Opening Hours</label>
          <textarea
            value={formData.openingHours}
            onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
            rows={6}
            placeholder="Monday: 9:00 AM - 6:00 PM&#10;Tuesday: 9:00 AM - 6:00 PM&#10;..."
            className="w-full px-4 py-2 border rounded-lg font-mono"
          />
        </div>
      </section>

      {/* Map Embed */}
      <section className="border rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Visit Us Map Embed</h2>
        <div className="space-y-2">
          <label className="block mb-2 font-semibold">Google Maps Embed HTML</label>
          <textarea
            value={formData.mapEmbedHtml}
            onChange={(e) => setFormData({ ...formData, mapEmbedHtml: e.target.value })}
            rows={5}
            placeholder='<iframe src="https://www.google.com/maps/embed?..."></iframe>'
            className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
          />
          <p className="text-sm text-gray-600">
            Paste the Google Maps embed iframe code. It will appear on the Visit Us page.
          </p>
        </div>
      </section>

      {/* Social Media */}
      <section className="border rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Social Media</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-semibold">Facebook URL</label>
            <input
              type="url"
              value={formData.facebookUrl}
              onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Instagram URL</label>
            <input
              type="url"
              value={formData.instagramUrl}
              onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Twitter URL</label>
            <input
              type="url"
              value={formData.twitterUrl}
              onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">TikTok URL</label>
            <input
              type="url"
              value={formData.tiktokUrl}
              onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Feature Toggles */}
      <section className="border rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Feature Toggles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'showHomepage', label: 'Show Homepage' },
            { key: 'showProductList', label: 'Show Product List' },
            { key: 'showSearch', label: 'Show Search' },
            { key: 'showAccountArea', label: 'Show Account Area' },
            { key: 'showContactPage', label: 'Show Contact Page' },
            { key: 'showLocationPage', label: 'Show Location Page' },
            { key: 'showBlog', label: 'Show Blog' },
            { key: 'showFAQ', label: 'Show FAQ' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData[key as keyof typeof formData] as boolean}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                className="w-4 h-4"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Shipping */}
      <section className="border rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-semibold">Shipping Mode</label>
            <select
              value={formData.shippingMode}
              onChange={(e) => setFormData({ ...formData, shippingMode: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="flat">Flat Rate</option>
              <option value="stripe">Stripe Shipping</option>
            </select>
          </div>
          {formData.shippingMode === 'flat' && (
            <>
              <div>
                <label className="block mb-2 font-semibold">Flat Shipping Rate (cents)</label>
                <input
                  type="number"
                  value={formData.flatShippingRateCents}
                  onChange={(e) => setFormData({ ...formData, flatShippingRateCents: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Flat Shipping Label</label>
                <input
                  type="text"
                  value={formData.flatShippingLabel}
                  onChange={(e) => setFormData({ ...formData, flatShippingLabel: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </>
          )}
        </div>
      </section>

      {/* Stripe Configuration */}
      <section className="border rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Stripe Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-semibold">Stripe Secret Key</label>
            <input
              type="password"
              value={formData.stripeSecretKey}
              onChange={(e) => setFormData({ ...formData, stripeSecretKey: e.target.value })}
              placeholder="sk_test_..."
              className="w-full px-4 py-2 border rounded-lg font-mono"
            />
            <p className="text-sm text-gray-600 mt-1">
              Your Stripe secret key (starts with sk_test_ or sk_live_)
            </p>
          </div>
          <div>
            <label className="block mb-2 font-semibold">Stripe Publishable Key</label>
            <input
              type="text"
              value={formData.stripePublishableKey}
              onChange={(e) => setFormData({ ...formData, stripePublishableKey: e.target.value })}
              placeholder="pk_test_..."
              className="w-full px-4 py-2 border rounded-lg font-mono"
            />
            <p className="text-sm text-gray-600 mt-1">
              Your Stripe publishable key (starts with pk_test_ or pk_live_)
            </p>
          </div>
          {formData.stripeSecretKey && formData.stripePublishableKey && (
            <div className="p-4 bg-green-100 border border-green-400 rounded">
              <p className="text-green-700">Stripe keys configured</p>
            </div>
          )}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-gray-900 text-white rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  )
}

