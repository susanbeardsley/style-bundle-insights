'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Papa from 'papaparse';
import { loadData, getDataStore, setDataStore } from '@/lib/data-loader';
import {
  Occasion,
  Sentiment,
  OccasionSentimentRelationship,
  Persona,
  BundleArchetype,
  Tag,
  EntityTag,
  MediaAsset,
  VersionLog,
  User,
} from '@/types';

// CSV data imports - embedded directly
import occasionsData from '@/data/occasions.json';
import sentimentsData from '@/data/sentiments.json';
import relationshipsData from '@/data/relationships.json';
import personasData from '@/data/personas.json';
import bundlesData from '@/data/bundles.json';
import tagsData from '@/data/tags.json';
import entityTagsData from '@/data/entity-tags.json';
import mediaAssetsData from '@/data/media-assets.json';
import versionLogsData from '@/data/version-logs.json';
import usersData from '@/data/users.json';

interface DataContextType {
  occasions: Occasion[];
  sentiments: Sentiment[];
  relationships: OccasionSentimentRelationship[];
  personas: Persona[];
  bundles: BundleArchetype[];
  tags: Tag[];
  entityTags: EntityTag[];
  mediaAssets: MediaAsset[];
  versionLogs: VersionLog[];
  users: User[];
  loaded: boolean;
  reload: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DataContextType>({
    occasions: [],
    sentiments: [],
    relationships: [],
    personas: [],
    bundles: [],
    tags: [],
    entityTags: [],
    mediaAssets: [],
    versionLogs: [],
    users: [],
    loaded: false,
    reload: () => {},
  });

  const loadAllData = () => {
    try {
      const store = loadData({
        occasions: occasionsData as Record<string, string>[],
        sentiments: sentimentsData as Record<string, string>[],
        relationships: relationshipsData as Record<string, string>[],
        personas: personasData as Record<string, string>[],
        bundles: bundlesData as Record<string, string>[],
        tags: tagsData as Record<string, string>[],
        entityTags: entityTagsData as Record<string, string>[],
        mediaAssets: mediaAssetsData as Record<string, string>[],
        versionLogs: versionLogsData as Record<string, string>[],
        users: usersData as Record<string, string>[],
      });

      setData({
        ...store,
        reload: loadAllData,
      });
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
