'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Ruler,
  Activity,
  Footprints,
  Zap,
  Save,
  Check,
  Scissors,
  BookOpen,
} from 'lucide-react';

export default function SizeProfilePage() {
  const [isSaved, setIsSaved] = useState(false);
  const [profile, setProfile] = useState({
    height: '',
    weight: '',
    topSize: 'M',
    bottomSize: '32',
    shoeSize: '42',
    sockSize: '39-42',
    fitPreference: 'regular',
    headSize: '',
    wristSize: '',
    shoulderWidth: '',
    gloveSize: 'M',
  });

  useEffect(() => {
    const saved = localStorage.getItem('measure_profile');
    if (saved) {
      const timer = setTimeout(() => {
        setProfile(JSON.parse(saved));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('measure_profile', JSON.stringify(profile));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const updateField = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className='size-profile-container'>
      <div className='account-header'>
        <h1 className='account-title'>My Sizes & Fit</h1>
        <p className='account-subtitle'>
          Save your measurements for a perfect fit across the shop.
        </p>
      </div>

      <form onSubmit={handleSave} className='size-form'>
        <div className='size-grid'>
          {/* Physique Section */}
          <div className='size-card'>
            <div className='card-header'>
              <Activity className='card-icon' size={20} />
              <h3>Body Measurements</h3>
            </div>
            <div className='card-fields'>
              <div className='field-group'>
                <label>Height (cm)</label>
                <input
                  type='number'
                  value={profile.height}
                  onChange={(e) => updateField('height', e.target.value)}
                  placeholder='e.g. 180'
                />
              </div>
              <div className='field-group'>
                <label>Weight (kg)</label>
                <input
                  type='number'
                  value={profile.weight}
                  onChange={(e) => updateField('weight', e.target.value)}
                  placeholder='e.g. 75'
                />
              </div>
            </div>
          </div>

          {/* Garment Section */}
          <div className='size-card'>
            <div className='card-header'>
              <Ruler className='card-icon' size={20} />
              <h3>Clothing Sizes</h3>
            </div>
            <div className='card-fields'>
              <div className='field-group'>
                <label>Shirt / Top Size</label>
                <select
                  value={profile.topSize}
                  onChange={(e) => updateField('topSize', e.target.value)}
                >
                  <option value='XS'>XS - Extra Small</option>
                  <option value='S'>S - Small</option>
                  <option value='M'>M - Medium</option>
                  <option value='L'>L - Large</option>
                  <option value='XL'>XL - XL</option>
                  <option value='XXL'>XXL - XXL</option>
                </select>
              </div>
              <div className='field-group'>
                <label>Pants / Waist Size</label>
                <select
                  value={profile.bottomSize}
                  onChange={(e) => updateField('bottomSize', e.target.value)}
                >
                  {Array.from({ length: 15 }, (_, i) => 26 + i * 2).map(
                    (size) => (
                      <option key={size} value={size}>
                        {size}&quot; (W)
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Footwear Section */}
          <div className='size-card'>
            <div className='card-header'>
              <Footprints className='card-icon' size={20} />
              <h3>Shoes & Socks</h3>
            </div>
            <div className='card-fields'>
              <div className='field-group'>
                <label>Shoe Size (EU)</label>
                <select
                  value={profile.shoeSize}
                  onChange={(e) => updateField('shoeSize', e.target.value)}
                >
                  {Array.from({ length: 15 }, (_, i) => 35 + i).map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              <div className='field-group'>
                <label>Sock Size</label>
                <select
                  value={profile.sockSize}
                  onChange={(e) => updateField('sockSize', e.target.value)}
                >
                  <option value='35-38'>35 - 38</option>
                  <option value='39-42'>39 - 42</option>
                  <option value='43-46'>43 - 46</option>
                </select>
              </div>
            </div>
          </div>

          {/* Armour & Accoutrements Section */}
          <div className='size-card'>
            <div className='card-header'>
              <Scissors className='card-icon' size={20} />
              <h3>Special Measurements</h3>
            </div>
            <div className='card-fields'>
              <div className='field-group'>
                <label>Shoulder Width (cm)</label>
                <input
                  type='number'
                  value={profile.shoulderWidth}
                  onChange={(e) => updateField('shoulderWidth', e.target.value)}
                  placeholder='Corner to corner'
                />
              </div>
              <div className='field-group'>
                <label>Glove Size</label>
                <select
                  value={profile.gloveSize}
                  onChange={(e) => updateField('gloveSize', e.target.value)}
                >
                  <option value='S'>S - Small</option>
                  <option value='M'>M - Medium</option>
                  <option value='L'>L - Large</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tailoring & Style */}
          <div className='size-card'>
            <div className='card-header'>
              <Zap className='card-icon' size={20} />
              <h3>How You Like Your Fit</h3>
            </div>
            <div className='card-fields'>
              <div className='field-group'>
                <label>Preferred Style</label>
                <div className='fit-options'>
                  {['Tight', 'Regular', 'Oversized'].map((fit) => (
                    <button
                      key={fit}
                      type='button'
                      className={`fit-btn ${profile.fitPreference === fit.toLowerCase() ? 'active' : ''}`}
                      onClick={() =>
                        updateField('fitPreference', fit.toLowerCase())
                      }
                    >
                      {fit}
                    </button>
                  ))}
                </div>
              </div>
              <div className='field-group'>
                <label>Head Circumference (cm)</label>
                <input
                  type='number'
                  value={profile.headSize}
                  onChange={(e) => updateField('headSize', e.target.value)}
                  placeholder='For hats (e.g. 58)'
                />
              </div>
              <div className='field-group'>
                <label>Wrist Size (cm)</label>
                <input
                  type='number'
                  value={profile.wristSize}
                  onChange={(e) => updateField('wristSize', e.target.value)}
                  placeholder='For bracelets (e.g. 18)'
                />
              </div>
            </div>
          </div>
        </div>

        <div className='size-guide-info'>
          <BookOpen size={14} className='info-icon' />
          <span>Not sure about your sizes?</span>
          <Link href='/size-guide' className='guide-link-inline'>
            Consult our official Size Guide
          </Link>
        </div>

        <div className='form-actions'>
          <button
            type='submit'
            className={`save-profile-btn ${isSaved ? 'success' : ''}`}
          >
            {isSaved ? <Check size={18} /> : <Save size={18} />}
            {isSaved ? 'Sizes Saved' : 'Save My Size Profile'}
          </button>
          <p className='save-hint'>Your data is only stored in your browser.</p>
        </div>
      </form>

      <style jsx>{`
        .size-profile-container {
        }
        .profile-header {
          margin-bottom: 3rem;
        }
        .size-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }
        .size-card {
          background: rgba(13, 10, 15, 0.4);
          border: 1px solid rgba(139, 115, 85, 0.15);
          padding: 2rem;
          transition: all 0.3s ease;
        }
        .size-card:hover {
          border-color: var(--accent);
          background: rgba(26, 10, 31, 0.6);
        }
        .card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          color: var(--aged-brass);
        }
        .card-header h3 {
          font-family: 'Cinzel', serif;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 1rem;
        }
        .card-fields {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .field-group label {
          font-family: 'Cinzel', serif;
          font-size: 0.7rem;
          color: var(--aged-silver);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .field-group input,
        .field-group select {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(139, 115, 85, 0.2);
          color: var(--bone);
          padding: 0.75rem;
          font-family: 'Crimson Text', serif;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
        }
        .field-group input:focus,
        .field-group select:focus {
          border-color: var(--accent);
          background: rgba(139, 115, 85, 0.05);
        }
        .fit-options {
          display: flex;
          gap: 0.5rem;
        }
        .fit-btn {
          flex: 1;
          background: transparent;
          border: 1px solid rgba(139, 115, 85, 0.2);
          color: var(--aged-silver);
          padding: 0.5rem;
          font-family: 'Cinzel', serif;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .fit-btn.active {
          background: var(--aged-brass);
          color: #000;
          border-color: var(--aged-brass);
        }
        .size-guide-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 3rem;
          color: var(--aged-silver);
          font-family: 'Crimson Text', serif;
          font-size: 0.95rem;
          background: rgba(139, 115, 85, 0.05);
          padding: 0.75rem;
          border-radius: 4px;
          border: 1px dashed rgba(139, 115, 85, 0.2);
        }
        .info-icon {
          color: var(--aged-brass);
          opacity: 0.7;
        }
        .guide-link-inline {
          color: var(--aged-brass);
          text-decoration: underline;
          text-underline-offset: 3px;
          font-family: 'Cinzel', serif;
          font-size: 0.75rem;
          letter-spacing: 1px;
          transition: all 0.3s ease;
        }
        .guide-link-inline:hover {
          color: var(--accent);
          filter: drop-shadow(0 0 5px var(--accent));
        }
        .form-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
        }
        .save-profile-btn {
          padding: 1rem 3rem;
          background: #0d0a0f;
          border: 1px solid var(--aged-brass);
          color: var(--aged-brass);
          font-family: 'Cinzel', serif;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.5s ease;
        }
        .save-profile-btn:hover {
          background: var(--aged-brass);
          color: #000;
        }
        .save-profile-btn.success {
          background: #2e4d2e;
          color: #fff;
          border-color: #4e8d4e;
        }
        .save-hint {
          font-family: 'IM Fell DW Pica', serif;
          font-style: italic;
          color: var(--aged-silver);
          font-size: 0.9rem;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}
