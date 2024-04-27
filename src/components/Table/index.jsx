import { useEffect, useState } from 'react'
import { Table, Tag, Space, Select,Input } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import axios from 'axios'
const { Option } = Select;
const { Search } = Input;
const PostsTable = () => {

    const [posts,setPosts] =useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    //const [tagOptions, setTagOptions] = useState([]);

    const allTags = posts.reduce((tags, post) => {
        post.tags.forEach(tag => {
          if (!tags.includes(tag)) {
            tags.push(tag);
          }
        });
        return tags;
      }, []);

   

    console.log("posts",posts)
     const fetchPosts = async()=>{
       try {
         const response = await axios.get('https://dummyjson.com/posts')
         setPosts(response.data.posts.map(post => ({
            ...post,
            tags: post.tags.map((tag)=>(tag)) // Mocking tags data for demonstration
          })));
          setLoading(false);
      //    setTagOptions(allTags);
          

         //console.log("data",response.data.posts)
       } catch (error) {
         console.error('Error fetching data:', error);
         setError('An error occurred while fetching data.');
         setLoading(false);
       }
     }

     const handleSearch = searchText => {
        setSearchText(searchText);
      };

      const handleTagChange = selectedTagKeys => {
        setSelectedTags(selectedTagKeys);
      };


    // const filteredPosts = searchText
    // ? posts.filter(post => post.body.toLowerCase().includes(searchText.toLowerCase()))
    // : posts;
   
    const filteredPosts = posts.filter(post => {
      // Filter by search text
      if (searchText && !post.body.toLowerCase().includes(searchText.toLowerCase())) {
        return false;
      }
  
      // Filter by selected tags
      if (selectedTags.length > 0) {
        const postTags = post.tags.map(tag => tag.toLowerCase());
        return selectedTags.every(tag => postTags.includes(tag.toLowerCase()));
      }
  
      return true;
    });

     useEffect(()=>{
       fetchPosts()
       
     },[])

      const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
          },
        {
          title: 'Title',
          dataIndex: 'title',
          key: 'title',
        },
        {
          title: 'Body',
          dataIndex: 'body',
          key: 'body',
        },
        {
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
            render: tags => (
              <>
                {tags.map((tag) => (
                  <Tag color="blue" key={tag}>
                    {tag}
                  </Tag>
                ))}
              </>
            ),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
              <div style={{ padding: 8 }}>
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: '100%' }}
                  placeholder="Select tags"
                  value={selectedTags}
                  onChange={handleTagChange}
                  onBlur={() => confirm()}
                >
                 {posts.flatMap(post => post.tags.map(tag => tag.toLowerCase())).reduce((uniqueTags, tag) => {
          if (!uniqueTags.includes(tag)) {
            uniqueTags.push(tag);
          }
          return uniqueTags;
        }, []).map(tag => (
          <Option key={tag} value={tag}>{tag}</Option>
        ))}
                </Select>
                <Space>
                  <button
                    type="primary"
                    onClick={() => {
                      confirm();
                    }}
                    size="small"
                    style={{ width: 90 }}
                  >
                    Filter
                  </button>
                  <button
                    onClick={() => {
                      clearFilters();
                    }}
                    size="small"
                    style={{ width: 90 }}
                  >
                    Reset
                  </button>
                </Space>
              </div>
            ),
            filterIcon: filtered => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
          },
    
      ];
      
     
  return (
    <div>
     <Search
        placeholder="Search posts"
        allowClear
        onSearch={handleSearch}
        onChange={e => handleSearch(e.target.value)}
        style={{ width: 500, marginBottom: 16 }}
      />
      {error ? (
        <div className="error">{error}</div>
      ) : (
        <Table
          columns={columns}
          loading={loading}
          dataSource={filteredPosts}
          rowKey="id"
          bordered
        />
      )}
      
    </div>
  )
}

export default PostsTable
