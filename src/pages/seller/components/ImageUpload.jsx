// ImageUpload.jsx — 파일 입력 + 미리보기
import { useEffect, useState } from 'react';

export default function ImageUpload({ label, name, preview, onChange, required }) {
  const [localPreview, setLocalPreview] = useState(preview);

  useEffect(() => { setLocalPreview(preview); }, [preview]);

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">
        {label}{required && ' *'}
      </label>
      <input
        type="file"
        name={name}
        accept="image/*"
        onChange={(e) => {
          onChange(e);
          if (e.target.files?.[0]) {
            setLocalPreview(URL.createObjectURL(e.target.files[0]));
          }
        }}
        required={required}
      />
      {localPreview && (
        <img
          src={localPreview}
          alt="preview"
          className="mt-2 h-24 w-24 rounded object-cover"
        />
      )}
    </div>
  );
}
