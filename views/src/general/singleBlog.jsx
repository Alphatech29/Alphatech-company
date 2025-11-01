import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUser,
  FaCalendarAlt,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaShareAlt,
  FaEye,
} from "react-icons/fa";
import { RiArrowDropRightLine } from "react-icons/ri";
import {
  getBlogBySlug,
  getBlogs,
  addBlogComment,
  getCommentsByBlogId,
} from "../utilities/blog";
import { formatDate } from "../utilities/formatDate";
import {
  Card,
  TextInput,
  Textarea,
  Button,
  Alert,
  Spinner,
} from "flowbite-react";

const SingleBlog = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Comment state
  const [comments, setComments] = useState([]);
  const [commentName, setCommentName] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentStatus, setCommentStatus] = useState({ type: "", message: "" });

  const getTitleSimilarity = (title1, title2) => {
    const words1 = title1.toLowerCase().split(/\s+/);
    const words2 = title2.toLowerCase().split(/\s+/);
    const common = words1.filter((word) => words2.includes(word));
    return common.length;
  };

  // Fetch single blog and its comments
  useEffect(() => {
    const fetchBlogAndComments = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await getBlogBySlug(slug);

        if (result.success && result.data) {
          const fetchedBlog = result.data;
          setBlog(fetchedBlog);

          if (fetchedBlog.id) {
            const commentsResponse = await getCommentsByBlogId(fetchedBlog.id);
            if (commentsResponse.success) {
              const formattedComments = commentsResponse.data.map((c) => ({
                author: c.commenter_name,
                text: c.comment_text,
                date: c.created_at,
              }));

              setComments(formattedComments);
            } else {
              console.error(
                "Failed to load comments:",
                commentsResponse.message
              );
              setComments([]);
            }
          }
        } else {
          setError(result.message || "Blog not found.");
        }
      } catch (error) {
        console.error("Error fetching blog or comments:", error);
        setError("Failed to fetch blog.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogAndComments();
  }, [slug]);

  // Fetch recent blogs
  useEffect(() => {
    const fetchRecentBlogs = async () => {
      try {
        const response = await getBlogs();
        const allBlogs = response.data || [];
        const sorted = allBlogs
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .slice(0, 5);
        setRecentBlogs(sorted);
      } catch (err) {
        console.error("Failed to fetch recent blogs:", err);
      }
    };
    fetchRecentBlogs();
  }, []);

  // Fetch related blogs
  useEffect(() => {
    if (!blog) return;

    const fetchRelatedBlogs = async () => {
      try {
        const response = await getBlogs();
        const allBlogs = response.data || [];

        const otherBlogs = allBlogs.filter((b) => b.slug !== blog.slug);

        const scoredBlogs = otherBlogs.map((b) => {
          const categoryScore = b.category === blog.category ? 1 : 0;
          const titleScore = getTitleSimilarity(blog.title, b.title);
          return { ...b, score: categoryScore + titleScore };
        });

        const related = scoredBlogs
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);

        setRelatedBlogs(related);
      } catch (err) {
        console.error("Failed to fetch related blogs:", err);
      }
    };

    fetchRelatedBlogs();
  }, [blog]);

  useEffect(() => {
    document.title = blog?.title
      ? `${blog.title} | Alphatech Blog`
      : "Loading Blog... | Alphatech Blog";
  }, [blog]);

  // Handle comment submission
  const handleAddComment = async (e) => {
    e.preventDefault();
    setCommentStatus({ type: "", message: "" });

    if (!commentName.trim() || !commentInput.trim()) {
      setCommentStatus({
        type: "error",
        message: "Please provide both your name and comment.",
      });
      return;
    }

    const commentData = {
      blog_id: blog.id,
      commenter_name: commentName.trim(),
      comment_text: commentInput.trim(),
    };

    try {
      setIsSubmitting(true);
      const response = await addBlogComment(commentData);
      setIsSubmitting(false);

      if (response.success) {
        const newComment = {
          author: commentName.trim(),
          text: commentInput.trim(),
          date: new Date().toISOString(),
        };

        setComments([newComment, ...comments]);
        setCommentName("");
        setCommentInput("");
        setCommentStatus({
          type: "success",
          message: "Your comment was added successfully.",
        });
      } else {
        setCommentStatus({
          type: "error",
          message: response.message || "Failed to add comment.",
        });
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error adding comment:", error);
      setCommentStatus({
        type: "error",
        message: "A server error occurred while adding your comment.",
      });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg animate-pulse">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-500 text-lg font-medium">{error}</p>
      </div>
    );

  const shareUrl = window.location.href;
  const encodedTitle = encodeURIComponent(blog.title);
  const encodedUrl = encodeURIComponent(shareUrl);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt || "Check out this post!",
          url: shareUrl,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] w-full overflow-hidden flex items-center justify-center">
        <img
          src={blog.cover_image}
          alt={blog.title}
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute text-center text-white px-4 max-w-3xl mt-28"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3 [text-shadow:0_4px_8px_rgba(246,107,4,0.6)]">
            {blog.title}
          </h1>
          <div className="flex justify-center items-center gap-4 text-sm text-gray-200">
            <span className="flex items-center gap-1">
              <FaUser className="text-primary" /> {blog.author}
            </span>
            <span className="flex items-center gap-1">
              <FaEye className="text-primary" /> {blog.views}
            </span>
            <span className="flex items-center gap-1">
              <FaCalendarAlt className="text-primary" />{" "}
              {formatDate(blog.created_at)}
            </span>
          </div>
        </motion.div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Main Article */}
        <div className="lg:col-span-3 space-y-8 ">
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg max-w-none text-gray-800 border-t-8 border-primary-500 rounded-lg p-6 shadow-primary-500 hover:shadow-lg transition"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Share Section */}
          <div className="bg-gray-50 p-5 border-t-8 border-primary-500 rounded-lg shadow-primary-500 hover:shadow-lg transition">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FaShareAlt className="text-primary" /> Share this post
            </h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(shareLinks).map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-full ${
                    key === "facebook"
                      ? "bg-blue-600 text-white"
                      : key === "twitter"
                      ? "bg-sky-500 text-white"
                      : key === "linkedin"
                      ? "bg-blue-800 text-white"
                      : "bg-green-500 text-white"
                  } hover:opacity-80 transition`}
                >
                  {key === "facebook" && <FaFacebookF />}
                  {key === "twitter" && <FaTwitter />}
                  {key === "linkedin" && <FaLinkedinIn />}
                  {key === "whatsapp" && <FaWhatsapp />}
                </a>
              ))}
              <button
                onClick={handleNativeShare}
                className="p-2 rounded-full bg-primary text-white hover:opacity-90 transition"
              >
                <FaShareAlt />
              </button>
            </div>
          </div>

          {/* Comment Section */}
          <div className="bg-gray-50 p-6 border-t-8 border-primary-500 rounded-lg shadow-primary-500 hover:shadow-lg transition mt-8">
            <div className="flex justify-center items-center mb-3">
              <h2 className="text-2xl font-semibold">Leave a comment</h2>
            </div>
            <h3 className="font-semibold text-gray-800 mb-4">
              Comments ({comments.length})
            </h3>

            <form onSubmit={handleAddComment} className="mb-6 space-y-3">
              <TextInput
                type="text"
                placeholder="Your name"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                sizing="md"
                shadow
              />
              <Textarea
                placeholder="Add a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                rows={3}
                shadow
                required
              />
              <Button
                type="submit"
                className="w-fit py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Spinner size="sm" light /> Posting...
                  </span>
                ) : (
                  "Submit Comment"
                )}
              </Button>

              {commentStatus.message && (
                <Alert
                  color={
                    commentStatus.type === "success" ? "success" : "failure"
                  }
                  className="mt-3"
                >
                  {commentStatus.message}
                </Alert>
              )}
            </form>

            {/* Display Comments */}
            {comments.length === 0 ? (
              <p className="text-gray-500">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className="space-y-4">
                {comments.map((c, i) => (
                  <Card key={i} className="border-l-4 border-primary-600 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 font-semibold text-gray-800">
                        <FaUser className="text-primary" />{" "}
                        {c.author
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </span>

                      <span className="text-xs text-gray-400">
                        {formatDate(c.date)}
                      </span>
                    </div>
                    <p className="text-gray-700">{c.text}</p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="bg-gray-50 p-4 border-t-8 border-primary-500 rounded-lg shadow-primary-500 hover:shadow-lg transition">
            <h3 className="font-semibold text-gray-800 mb-3">Recently Added</h3>
            <ul className="space-y-2">
              {recentBlogs.map((recent) => (
                <li key={recent.slug} className="flex items-center gap-1">
                  <RiArrowDropRightLine className="text-primary-700 text-[50px]" />
                  <NavLink
                    to={`/blog/${recent.slug}`}
                    className="text-primary-800 hover:underline"
                  >
                    {recent.title}
                  </NavLink>
                </li>
              ))}
              {recentBlogs.length === 0 && (
                <li className="text-gray-500 text-sm">No recent posts</li>
              )}
            </ul>
          </div>

          {/* Advertisement */}
          <div className="bg-gray-50 p-4 border-t-8 border-primary-500 rounded-lg shadow-primary-500 hover:shadow-lg transition">
            <h3 className="font-semibold text-gray-800 mb-3">Advertisement</h3>
            <div className="flex flex-col items-center justify-center">
              <img
                src="/path-to-your-ad-image.jpg"
                alt="Advertisement"
                className="w-full h-40 object-cover rounded-lg mb-2"
              />
              <p className="text-gray-700 text-center text-sm">
                Promote your business here! Contact us for advertising
                opportunities.
              </p>
            </div>
          </div>
        </aside>
      </section>

      {/* Related Posts */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Posts</h2>
        <div className="grid grid-cols-1  md:grid-cols-3 gap-4">
          {relatedBlogs.length > 0 ? (
            relatedBlogs.map((rel) => (
              <NavLink
                key={rel.slug}
                to={`/blog/${rel.slug}`}
                className="block bg-gray-50 rounded-xl p-4 shadow hover:shadow-lg transition"
              >
                <img
                  src={rel.cover_image}
                  alt={rel.title}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <h3 className="font-semibold text-gray-800">{rel.title}</h3>
                <p className="text-sm text-gray-500">
                  {formatDate(rel.created_at)}
                </p>
              </NavLink>
            ))
          ) : (
            <p className="text-gray-500">No related posts found.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default SingleBlog;
