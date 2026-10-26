import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Store, X, Check, AlertCircle, Upload } from 'lucide-react';
import { getShops, addShop, updateShop, deleteShop } from '../services/localStorageService';
import { validateShopForm } from '../utils/validation';

const SERVICES_LIST = [
  'Gold Ring Repair', 'Gold Chain Repair', 'Necklace Repair', 'Bracelet Repair',
  'Earring Repair', 'Diamond Jewellery Repair', 'Jewellery Polishing',
  'Stone Replacement', 'Jewellery Cleaning', 'Custom Jewellery Repair',
];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const STATES = ['Andhra Pradesh', 'Assam', 'Bihar', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'];

const EMPTY_FORM = {
  name: '', owner: '', contact: '', email: '',
  address: '', city: '', state: '', pincode: '',
  description: '', services: [], openTime: '09:00', closeTime: '20:00',
  closingDay: 'Sunday', status: 'active', image: '',
};

export default function ShopManagement() {
  const [shops, setShops] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingShop, setEditingShop] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  const reload = () => setShops(getShops());
  useEffect(() => { reload(); }, []);

  const openAdd = () => {
    setEditingShop(null);
    setForm(EMPTY_FORM);
    setImagePreview('');
    setErrors({});
    setShowForm(true);
  };

  const openEdit = (shop) => {
    setEditingShop(shop);
    setForm({ ...EMPTY_FORM, ...shop });
    setImagePreview(shop.image || '');
    setErrors({});
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
  };

  const handleServiceToggle = (svc) => {
    setForm((f) => ({
      ...f,
      services: f.services.includes(svc)
        ? f.services.filter((s) => s !== svc)
        : [...f.services, svc],
    }));
    if (errors.services) setErrors((e) => ({ ...e, services: '' }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Image must be under 2MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setForm((f) => ({ ...f, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateShopForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (editingShop) {
      updateShop(editingShop.id, { ...form, updatedAt: new Date().toISOString() });
    } else {
      addShop({
        ...form,
        id: `shop-${Date.now()}`,
        rating: 4.5,
        reviews: 0,
        createdAt: new Date().toISOString(),
      });
    }
    reload();
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this shop? This action cannot be undone.')) {
      deleteShop(id);
      reload();
    }
  };

  const handleToggleStatus = (shop) => {
    updateShop(shop.id, { status: shop.status === 'active' ? 'inactive' : 'active' });
    reload();
  };

  const InputError = ({ field }) =>
    errors[field] ? (
      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
        <AlertCircle className="w-3.5 h-3.5" /> {errors[field]}
      </p>
    ) : null;

  const inputCls = (field) =>
    `w-full px-3 py-2.5 rounded-xl border text-sm input-gold ${errors[field] ? 'border-red-400' : ''}`;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-stone-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Shop Management
          </h1>
          <p className="text-stone-500 text-sm mt-0.5">{shops.length} shops registered</p>
        </div>
        <button onClick={openAdd}
          className="btn-gold flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm">
          <Plus className="w-4 h-4" /> Add New Shop
        </button>
      </div>

      {/* Shops grid */}
      {shops.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-amber-100">
          <Store className="w-16 h-16 text-amber-200 mx-auto mb-3" />
          <h3 className="font-bold text-stone-600 text-lg mb-2">No Shops Added Yet</h3>
          <p className="text-stone-400 text-sm mb-4">Add your first jewellery repair shop to get started.</p>
          <button onClick={openAdd} className="btn-gold px-6 py-2.5 rounded-xl text-white font-semibold text-sm">
            Add First Shop
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {shops.map((shop) => (
            <div key={shop.id} className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
              <div className="h-28 flex items-center justify-center relative"
                style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)' }}>
                {shop.image ? (
                  <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
                ) : <span className="text-4xl">🏪</span>}
                <div className="absolute top-2 right-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    shop.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {shop.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-stone-800 text-lg leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {shop.name}
                </h3>
                <p className="text-xs text-stone-400 mb-2">Owner: {shop.owner} | {shop.contact}</p>
                <p className="text-xs text-stone-500 mb-1">📍 {shop.city}, {shop.state}</p>
                <p className="text-xs text-stone-500 mb-3">🕐 {shop.openTime} – {shop.closeTime}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {(shop.services || []).slice(0, 2).map((s) => (
                    <span key={s} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                      {s}
                    </span>
                  ))}
                  {(shop.services || []).length > 2 && (
                    <span className="text-xs text-stone-400">+{shop.services.length - 2} more</span>
                  )}
                </div>
                <div className="flex gap-2 pt-2 border-t border-amber-50">
                  <button onClick={() => openEdit(shop)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => handleToggleStatus(shop)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      shop.status === 'active'
                        ? 'text-orange-700 bg-orange-50 hover:bg-orange-100'
                        : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                    }`}>
                    {shop.status === 'active' ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                    {shop.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => handleDelete(shop.id)}
                    className="flex items-center justify-center p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4 animate-fade-in">
            <div className="flex items-center justify-between p-5 border-b border-amber-100">
              <h2 className="font-bold text-stone-800 text-xl" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {editingShop ? 'Edit Shop' : 'Add New Shop'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { name: 'name', label: 'Shop Name', required: true },
                  { name: 'owner', label: 'Owner Name', required: true },
                  { name: 'contact', label: 'Contact Number', required: true },
                  { name: 'email', label: 'Email Address' },
                ].map(({ name, label, required }) => (
                  <div key={name}>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">{label}{required && ' *'}</label>
                    <input name={name} value={form[name]} onChange={handleChange}
                      className={inputCls(name)} placeholder={label} />
                    <InputError field={name} />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Full Address *</label>
                  <input name="address" value={form.address} onChange={handleChange}
                    className={inputCls('address')} placeholder="Street address" />
                  <InputError field="address" />
                </div>
                {[
                  { name: 'city', label: 'City', required: true },
                  { name: 'pincode', label: 'PIN Code', required: true },
                ].map(({ name, label, required }) => (
                  <div key={name}>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">{label}{required && ' *'}</label>
                    <input name={name} value={form[name]} onChange={handleChange}
                      className={inputCls(name)} placeholder={label} />
                    <InputError field={name} />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">State *</label>
                  <select name="state" value={form.state} onChange={handleChange} className={inputCls('state')}>
                    <option value="">-- Select State --</option>
                    {STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <InputError field="state" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Opening Time *</label>
                  <input type="time" name="openTime" value={form.openTime} onChange={handleChange}
                    className={inputCls('openTime')} />
                  <InputError field="openTime" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Closing Time *</label>
                  <input type="time" name="closeTime" value={form.closeTime} onChange={handleChange}
                    className={inputCls('closeTime')} />
                  <InputError field="closeTime" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Weekly Closing Day</label>
                  <select name="closingDay" value={form.closingDay} onChange={handleChange} className={inputCls('closingDay')}>
                    {DAYS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Status</label>
                  <select name="status" value={form.status} onChange={handleChange} className={inputCls('status')}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Shop Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange}
                    rows={2} className={inputCls('description')} placeholder="Brief description of the shop..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-600 mb-2">Services Offered *</label>
                  <div className="flex flex-wrap gap-2">
                    {SERVICES_LIST.map((svc) => (
                      <button key={svc} type="button" onClick={() => handleServiceToggle(svc)}
                        className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                          form.services.includes(svc)
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400'
                        }`}>
                        {form.services.includes(svc) && <Check className="w-3 h-3 inline mr-1" />}
                        {svc}
                      </button>
                    ))}
                  </div>
                  <InputError field="services" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Shop Image</label>
                  <div className="border-2 border-dashed border-amber-200 rounded-xl p-3 hover:border-amber-400 transition-colors">
                    {imagePreview ? (
                      <div className="flex items-center gap-3">
                        <img src={imagePreview} alt="Preview" className="h-16 rounded-lg object-cover" />
                        <button type="button" onClick={() => { setImagePreview(''); setForm((f) => ({ ...f, image: '' })); }}
                          className="text-xs text-red-500 hover:text-red-700">Remove</button>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Upload className="w-5 h-5 text-amber-400" />
                        <span className="text-xs text-stone-500">Upload shop image (max 2MB)</span>
                        <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2 border-t border-amber-100">
                <button type="submit" className="btn-gold flex-1 py-2.5 rounded-xl text-white font-semibold text-sm">
                  {editingShop ? 'Update Shop' : 'Add Shop'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="btn-gold-outline flex-1 py-2.5 rounded-xl font-semibold text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
