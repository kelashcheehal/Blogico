"use client";
import { supabase } from "@/lib/supabaseClient";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
const BlogContext = createContext(null);

const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  console.log(blogs);

  useEffect(() => {
    async function getBlogs() {
      let { data: blogs, error } = await supabase.from("blogs").select("*");
      if (error) {
        console.log(error);
      }
      if (blogs) {
        setBlogs(blogs);
      }
    }
    getBlogs();
  }, []);

  const value = useMemo(
    () => ({
      blogs,
      setBlogs,
    }),
    [blogs, setBlogs]
  );
  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};

export const useBlog = () => useContext(BlogContext);
export default BlogProvider;
