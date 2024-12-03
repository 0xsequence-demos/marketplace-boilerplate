import { Box } from '$ui';
import '@google/model-viewer';

const ModelViewer = ({ fileSrc, src }: { fileSrc: string; src?: string }) => {
	return (
		<Box className="bg-foreground/5">
			<model-viewer
				alt="3d model"
				class="h-[500px] w-full"
				auto-rotate
				camera-controls
				loading="eager"
				reveal="auto"
				src={fileSrc}
				poster={src}
				autoplay
				shadow-intensity="1"
				touch-action="pan-y"
			/>
		</Box>
	);
};

export default ModelViewer;
