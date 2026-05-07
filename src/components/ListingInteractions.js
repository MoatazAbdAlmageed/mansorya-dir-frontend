'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Send, ThumbsUp, User, Clock } from 'lucide-react';
import { getComments, createComment } from '@/lib/wp';

const ListingInteractions = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    author_name: '',
    author_email: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchComments();
    const likedPosts = JSON.parse(localStorage.getItem('liked-posts') || '[]');
    setIsLiked(likedPosts.includes(postId));
  }, [postId]);

  const fetchComments = async () => {
    try {
      const data = await getComments(postId);
      setComments(data);
    } catch (err) {
      console.error('Failed to fetch comments', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Note: WordPress REST API uses 'post' for the ID and 'content' for text
      // We also add the rating to the content or handle it via a plugin if available
      // Here we prepend it to the comment content for simplicity "like wp"
      const ratingStars = '⭐'.repeat(rating);
      const enhancedContent = `${ratingStars}\n\n${formData.content}`;

      await createComment({
        post: postId,
        author_name: formData.author_name,
        author_email: formData.author_email,
        content: enhancedContent,
      });

      setMessage({ type: 'success', text: 'تم إرسال تعليقك بنجاح! سيظهر بعد المراجعة.' });
      setFormData({ author_name: '', author_email: '', content: '' });
      setRating(5);
    } catch (err) {
      setMessage({ type: 'error', text: 'عذراً، حدث خطأ أثناء إرسال التعليق. حاول مرة أخرى.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLike = () => {
    const likedPosts = JSON.parse(localStorage.getItem('liked-posts') || '[]');
    let newLikedPosts;
    
    if (isLiked) {
      newLikedPosts = likedPosts.filter(id => id !== postId);
    } else {
      newLikedPosts = [...likedPosts, postId];
    }
    
    localStorage.setItem('liked-posts', JSON.stringify(newLikedPosts));
    setIsLiked(!isLiked);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <section style={{ marginTop: '4rem', direction: 'rtl' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <MessageSquare className="text-gradient" size={28} />
          <h2 style={{ margin: 0, fontSize: '1.8rem' }}>التعليقات والتقييمات</h2>
        </div>
        
        <button 
          onClick={toggleLike}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.75rem 1.5rem',
            borderRadius: '1rem',
            border: 'none',
            background: isLiked ? 'var(--primary)' : 'rgba(0, 150, 136, 0.1)',
            color: isLiked ? '#fff' : 'var(--primary)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontWeight: '600'
          }}
        >
          <ThumbsUp size={20} fill={isLiked ? '#fff' : 'none'} />
          <span>{isLiked ? 'تم الإعجاب' : 'أعجبني'}</span>
        </button>
      </div>

      <div className="single-grid" style={{ gap: '2rem' }}>
        {/* Comment List */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="loader"></div>
            </div>
          ) : comments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {comments.map((comment) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={comment.id} 
                  className="glass" 
                  style={{ padding: '1.5rem', background: '#fff' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                        <User size={24} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{comment.author_name}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                          <Clock size={14} />
                          <span>{formatDate(comment.date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div 
                    style={{ fontSize: '1rem', color: '#475569', lineHeight: '1.6' }}
                    dangerouslySetInnerHTML={{ __html: comment.content.rendered }}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '1.5rem', color: '#64748b' }}>
              <p>لا توجد تعليقات بعد. كن أول من يضع تقييماً!</p>
            </div>
          )}
        </div>

        {/* Comment Form */}
        <aside style={{ width: '100%', maxWidth: '400px' }}>
          <div className="glass" style={{ padding: '2rem', background: '#fff', position: 'sticky', top: '8rem' }}>
            <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>اترك تعليقك</h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>تقييمك</label>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onMouseEnter={() => setHoverRating(num)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(num)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <Star 
                        size={28} 
                        fill={(hoverRating || rating) >= num ? '#ffc107' : 'none'} 
                        color={(hoverRating || rating) >= num ? '#ffc107' : '#cbd5e1'} 
                        style={{ transition: 'all 0.2s' }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="author_name" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>الاسم</label>
                <input
                  type="text"
                  id="author_name"
                  required
                  value={formData.author_name}
                  onChange={(e) => setFormData({...formData, author_name: e.target.value})}
                  style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none' }}
                  placeholder="اسمك الكريم"
                />
              </div>

              <div>
                <label htmlFor="author_email" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  id="author_email"
                  value={formData.author_email}
                  onChange={(e) => setFormData({...formData, author_email: e.target.value})}
                  style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none' }}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="content" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>التعليق</label>
                <textarea
                  id="content"
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none', resize: 'none' }}
                  placeholder="اكتب رأيك هنا..."
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
              >
                {isSubmitting ? <div className="loader" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div> : <><Send size={18} /> إرسال التعليق</>}
              </button>

              <AnimatePresence>
                {message && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ 
                      padding: '1rem', 
                      borderRadius: '0.75rem', 
                      fontSize: '0.9rem',
                      background: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
                      color: message.type === 'success' ? '#059669' : '#dc2626',
                      border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`
                    }}
                  >
                    {message.text}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default ListingInteractions;
