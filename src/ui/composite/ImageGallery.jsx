// ImageGallery.jsx — 상세 이미지 단일 뷰
import PropTypes from 'prop-types';

/**
 * @param {string} detail 상세 설명 이미지 URL(세로형)
 */
export default function ImageGallery({ detail }) {
  return (
    <div className="w-full">
      <img
        src={detail}
        alt="상품 상세 이미지"
        className="mx-auto w-full max-w-[700px] rounded-lg shadow"
      />
    </div>
  );
}

ImageGallery.propTypes = {
  detail: PropTypes.string.isRequired,
};
