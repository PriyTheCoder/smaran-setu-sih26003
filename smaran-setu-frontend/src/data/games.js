import { Brain, Image, Hash, Search } from 'lucide-react'
export const games = [
  { id:'memory-match', title:'Memory Match', description:'Remember a small set of friendly objects and find them again.', duration:'2 min', icon:Brain, type:'memory' },
  { id:'picture-recall', title:'Picture Recall', description:'Look at a picture, then answer a simple question about it.', duration:'2 min', icon:Image, type:'picture' },
  { id:'pattern-recognition', title:'Pattern Recognition', description:'Tell the next item of the pattern', duration:'2 min', icon:Image, type:'picture' },
  { id:'object-recognition', title:'Find the Object', description:'Focus your attention and find the requested object.', duration:'1 min', icon:Search, type:'object' },
]
