import { Toggle } from '@/components/ui/toggle';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import {
	Bold,
	Heading as HeadingIcon,
	Italic,
	List,
	ListOrdered,
	Redo,
	Undo,
} from 'lucide-react';

const Toolbar = ({ editor }: { editor: Editor | null }) => {
	if (!editor) {
		return null;
	}

	return (
		<div className="border border-input bg-transparent rounded-md rounded-b-none p-1 flex justify-between border-b-0">
			<div>
				<Toggle
					size="sm"
					pressed={editor.isActive('bold')}
					onPressedChange={() => editor.chain().focus().toggleBold().run()}
				>
					<Bold className="w-4 h-4" />
				</Toggle>
				<Toggle
					size="sm"
					pressed={editor.isActive('italic')}
					onPressedChange={() => editor.chain().focus().toggleItalic().run()}
				>
					<Italic className="w-4 h-4" />
				</Toggle>
				<Toggle
					size="sm"
					pressed={editor.isActive('heading', { level: 1 })}
					onPressedChange={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
				>
					<HeadingIcon className="w-4 h-4" />
				</Toggle>
				<Toggle
					size="sm"
					pressed={editor.isActive('bulletList')}
					onPressedChange={() =>
						editor.chain().focus().toggleBulletList().run()
					}
				>
					<List className="w-4 h-4" />
				</Toggle>
				<Toggle
					size="sm"
					pressed={editor.isActive('orderedList')}
					onPressedChange={() =>
						editor.chain().focus().toggleOrderedList().run()
					}
				>
					<ListOrdered className="w-4 h-4" />
				</Toggle>
			</div>
			<div>
				<Toggle
					pressed={false}
					size="sm"
					onClick={() => editor.chain().undo().run()}
					disabled={!editor.can().chain().focus().undo().run()}
				>
					<Undo className="w-4 h-4" />
				</Toggle>
				<Toggle
					size="sm"
					pressed={false}
					onClick={() => editor.chain().redo().run()}
					disabled={!editor.can().chain().redo().run()}
				>
					<Redo className="w-4 h-4" />
				</Toggle>
			</div>
		</div>
	);
};

const RichTextEditor = ({
	value,
	onChange,
}: {
	value: string;
	onChange: (richText: string) => void;
}) => {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				bulletList: {
					keepMarks: true,
					keepAttributes: false,
					HTMLAttributes: {
						class: 'list-disc ml-4',
					},
				},
				orderedList: {
					keepMarks: true,
					keepAttributes: false,
					HTMLAttributes: {
						class: 'list-decimal ml-4',
					},
				},
			}),
			Heading.configure({
				HTMLAttributes: {
					class: 'text-lg font-bold',
				},
			}),
		],
		content: value,
		editorProps: {
			attributes: {
				class:
					'rounded-md border min-h-[150px] border-input px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 rounded-t-none',
			},
		},
		onUpdate({ editor }) {
			onChange(editor.getHTML());
		},
	});

	return (
		<div className="flex flex-col">
			<Toolbar editor={editor} />
			<EditorContent editor={editor} />
		</div>
	);
};

export default RichTextEditor;
