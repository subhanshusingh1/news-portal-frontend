import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { createNews } from '../redux/slicers/SubscribedNewsSlice';

export function CreateNews() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.news);
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate
  const queryParams = new URLSearchParams(location.search);

  const regionId = queryParams.get('regionId');
  const regionType = queryParams.get('regionType');
  const clerkUserId = queryParams.get('reporterId');

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    regionId: regionId || '',
    regionType: regionType || '',
    profileImage: null,
  });
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    const { name, files, value } = e.target;

    if (name === 'profileImage' && files?.[0]) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError('File size should be less than 5MB');
        return;
      }

      setImagePreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, profileImage: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.title.trim()) errors.push('Title is required');
    if (!description.trim()) errors.push('Description is required');
    if (!formData.regionId) errors.push('Region ID is required');
    if (!formData.regionType) errors.push('Region Type is required');
    if (!clerkUserId) errors.push('User ID is required');
    return errors;
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, profileImage: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const errors = validateForm();
    if (errors.length > 0) {
      setSubmitError(errors.join(', '));
      return;
    }

    const newsData = {
      title: formData.title.trim(),
      description: description.trim(),
      tags: formData.category,
      regionId: formData.regionId,
      regionType: formData.regionType,
      clerkUserId,
      file: formData.profileImage, // Changed from files array to single file
    };

    try {
      const result = await dispatch(createNews(newsData)).unwrap();

      // Reset form
      setFormData({
        title: '',
        category: '',
        regionId: regionId || '',
        regionType: regionType || '',
        profileImage: null,
      });
      setDescription('');
      setImagePreview(null);

      // Redirect to the news page with the created news ID
      navigate(`/news/${result.news._id}`);
    } catch (err) {
      setSubmitError(
        typeof err === 'string' ? err : 'Failed to create news. Please try again.'
      );
      console.error('Error creating news:', err);
    }
  };

  return (
    <section className="p-6 sm:p-8 lg:p-10  min-h-screen mt-10">
      <form
        className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-8"
        onSubmit={handleSubmit}
      >
        <h1 className="text-center mb-6 text-teal-900 text-2xl font-semibold">
          Upload Your News
        </h1>

        {submitError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {submitError}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              News Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter Category"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full h-48 p-3 text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
              placeholder="Enter your news content here..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
            {imagePreview && (
              <div className="mt-4 relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-auto rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 focus:ring-2 focus:ring-red-300"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 focus:ring-4 focus:ring-teal-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !description || !formData.title}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {error && <div className="mt-4 text-center text-red-600">{error}</div>}
    </section>
  );
}

export default CreateNews;
