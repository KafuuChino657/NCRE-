/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ContentArea } from './components/ContentArea';
import { topics } from './data/topics';

export default function App() {
  const [selectedTopicId, setSelectedTopicId] = useState(topics[0].id);
  const [jumpTarget, setJumpTarget] = useState<{ 
    subTopicId: string; 
    query?: string; 
    timestamp: number 
  } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectTopic = (topicId: string, subTopicId?: string, query?: string) => {
    setSelectedTopicId(topicId);
    if (subTopicId) {
      setJumpTarget({ 
        subTopicId, 
        query: query?.trim(), 
        timestamp: Date.now() 
      });
    } else {
      setJumpTarget(null);
    }
  };

  const selectedTopic = topics.find(t => t.id === selectedTopicId) || topics[0];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Sidebar 
        topics={topics}
        selectedId={selectedTopicId}
        onSelect={handleSelectTopic}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <ContentArea 
        topic={selectedTopic}
        jumpTarget={jumpTarget}
        searchQuery={searchQuery}
        onOpenSidebar={() => setIsSidebarOpen(true)}
      />
    </div>
  );
}

