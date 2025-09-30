export type Product = {
  id: number;
  title: string;
  description?: string;
  price: number;
  images: string[];
  category: 'sharpeners' | 'accessories' | 'stones';
};

export const products: Product[] = [
  {
    id: 1,
    title: 'MadEdge Model 1',
    price: 148.00,
    images: ['/images/madedgemodel1-1.jpg', '/images/madedgemodel1-2.jpg'],
    description: `
Modular sharpener with a rotary mechanism based on cutting-edge rotating clamp technology.<br />
<br />
- Clamps are made of steel (not aluminum).<br />
- All parts of the rotary mechanism are steel; rubbing surfaces hardened to 900HV.<br />
- MadEdge system includes a spherical nut to compensate for screw skew on thin knives.<br />
- Wear compensation is possible only in the MadEdge system.<br />
- Antifriction bronze bushing in the hinge ensures smooth stone movement.<br />
- Stone holder handle made of stained oak.<br />
- Minimum grinding angle: 10° per side.<br />
- Compatible with knives, scissors, and chisels.<br />
- Sharpening angles from 10° to 40° per side.<br />
- Stones fixed from 12 mm width and up to 220 mm length.<br />
- Compatible with both blank and standard stones.<br />
- Rotary mechanism accuracy: 0.2°.
`

    ,
    category: 'sharpeners',
  },
  {
    id: 2,
    title: 'MadEdge with Digital Sharpening Angle Measurement',
    price: 197.00,
    images: ['/images/madedgewithdigital-1.jpg', '/images/madedgewithdigital-2.jpg'],
    description: 'Only we have! MadEdge with integrated Digital Sharpening Angle Measurement. This configuration avoids the installation of additional mass on the clamping frame and avoids additional pressure on the grinding stone.',
    category: 'sharpeners',
  },
  {
    id: 3,
    title: 'MadEdge Model 2',
    price: 195.00,
    images: ['/images/madedgemodel2-1.jpg', '/images/madedgemodel2-2.jpg'],
    description: 'Unlike Model1, it has an additional pair of clamps fixed in the center. All parts are made of steel, no aluminum. Friction surfaces are hardened to a hardness of 900HV. The clamps are equipped with a spherical nut to compensate for the misalignment of the screw when securing thin knives. Moreover, in the case of thread wear in the clamps, it is necessary to replace only the nut and screw, and not the entire expensive clamp. Parts are coated with a polymer wear-resistant coating that covers car wheels. There is a mechanism for adjusting the wear of the seats of the rotary mechanism. The guide is heat-treated to a hardness of 60HRC; for smoothness of movement, sliding is carried out along the bearing. The hinge has extended turning angles, which provides a comfortable sharpening of long knives. The stone holder has a substrate, which allows you to use stones with blank and without blank. The base is supported on 3 points, which ensures the stability of the sharpener on any surface.',
    category: 'sharpeners',
  },
  {
    id: 4,
    title: 'MadEdge for convex',
    price: 158.00,
    images: ['/images/madedgeforconvex-1.jpg', '/images/madedgeforconvex-2.jpg'],
    description: `
1. Clamps are made of steel, not aluminum.<br />
2. All parts of the rotary mechanism are also made of steel, and not of bronze and aluminum. Rubbing surfaces are hardened to hardness 740HV.<br />
3. Only in the MadEdge system, the clamps have a spherical nut to compensate for the screw skew when attaching thin knives.<br />
4. Only in the MadEdge system is it possible to compensate for the wear of the turning mechanism.<br />
5. An antifriction bronze bushing is pressed into the hinge of the sliding assembly, which ensures an increased smoothness of the movement of the stone.<br />
6. The handle of the stone holder is made of stained oak.<br />
7. The minimum angle of grinding is 12 degrees per side.
`
    ,
    category: 'sharpeners',
  },
  {
    id: 5,
    title: 'MadEdge rotary mechanism Model 1',
    price: 80.00,
    images: ['/images/rotarymechanism-1.jpg', '/images/rotarymechanism-2.jpg'],
    description: `The MadEdge rotary mechanism consists of a rotary unit with two symmetrical fixed positions of the rotary frame and clamps. Despite the very powerful spring of the rotary mechanism (it is quite difficult to pull the turn signal away from the fixation point), rotation around its axis is very easy, and there is no need to pull the mechanism towards yourself, as some manufacturers suggest.<br />
<br />
PRODUCT INFO <br />
An adjusting nut is provided, with which you can change the compression ratio of the spring and, accordingly, the force when turning the mechanism. All rubbing parts are made of steel with surface hardening of rubbing elements, which greatly increases their service life. Parts of the mechanism have a wear-resistant polymer coating, similar to the coating of car wheels. The length of the frame of the rotary mechanism is 200 mm. The clamping jaws are made of heat-treated steel. The slant of the jaws is 8 degrees per side, which allows you to comfortably sharpen knives with a sharpening angle of up to 12 degrees per side. A spherical nut is used in the clamps, which compensates for the misalignment of the screw when securing thin knives. The minimum center distance at the jaws of the holder is 57 mm (maximum - 168 mm), the width of the jaws is 15 mm. Accordingly, the minimum blade length for comfortable sharpening in two clamps without the use of additional devices is about 80 mm. For short blades, you can use fixing either in one clamp, or use the additional option in the form of a fork for clamping jaws, which allows you to rigidly fix the position of the clamps even close to each other. For fixing the mechanism, a threaded hole M8 is made.`,
    category: 'accessories',
  },
  {
    id: 6,
    title: 'Diamonds stones',
    price: 85.00,
    images: ['/images/diamondstones.jpg', '/images/diamondstones.jpg'],
    description: 'Set of four stones. Type: Monolayer metal bond bar with diamonds evenly distributed throughout the volume View: Rectangular, plane-parallel solid diamond The size of the working layer is 150mm x 25mm x3 mm. Deviations of linear dimensions + -0.1 mm Material Copper-tin bond, diamond concentration 100%',
    category: 'stones'
  },
  {
    id: 7,
    title: 'Table mount',
    price: 16.00,
    images: ['/images/tablemount-1.jpg', '/images/tablemount-2.jpg'],
    description: 'delivery - 15 $',
    category: 'accessories'
  },
  {
    id: 8,
    title: 'Hinge with rest hook',
    price: 10.00,
    images: ['/images/hinge-1.jpg', '/images/hinge-2.jpg'],
    description: 'Diameter of hole 8mm. The hinge has a pressed-in sleeve made of antifriction bronze to ensure increased smoothness.',
    category: 'accessories'
  },
  {
    id: 9,
    title: 'MadEdge clamp for full flat',
    price: 23.00,
    images: ['/images/clamp-1.jpg', '/images/clamp-2.jpg'],
    description: 'The clamps are made of heat-treated spring steel. Designed for fixing knives with full flat. The price is for 1 pc. A pair of clamps cost $46',
    category: 'accessories'
  },
  {
    id: 10,
    title: 'Adapter for sharpening flat chisels',
    price: 13.00,
    images: ['/images/adaptersharp-1.jpg', '/images/adaptersharp-2.jpg'],
    description: 'The presence of such an adapter will allow not only knives and scissors to be sharpened with the help of the MadEdge system, but also flat chisels.',
    category: 'accessories'
  },
  {
    id: 11,
    title: 'Hinge 360°',
    price: 27.00,
    images: ['/images/hinge360-1.jpg', '/images/hinge360-2.jpg'],
    description: 'Improved hinge for sharpening system. A distinctive feature of the hinge is that the vertical axis of rotation, the horizontal axis of rotation, and the axis of movement of the rail intersect at one point. This allows you to ensure a constant sharpening angle in the straight section of the blade.',
    category: 'accessories'
  },
  {
    id: 12,
    title: 'Adapter for clamps',
    price: 10.00,
    images: ['/images/adapterclamps-1.jpg', '/images/adapterclamps-2.jpg'],
    description: 'Center clamp adapter. Allows placing clamps for sharpening short knives. Please note the adapter is available without clamps.',
    category: 'accessories'
  },
  {
    id: 13,
    title: 'Hinge for convex',
    price: 9.00,
    images: ['/images/hingeconvex-1.jpg', '/images/hingeconvex-2.jpg'],
    description: `If you need to sharpen the knife with convex, our system will help to you do this. It's enough to use this hinge. All parts are made of steel.`,
    category: 'accessories'
  },
  {
    id: 14,
    title: 'Sharpening stones',
    price: 37.00,
    images: ['/images/sharpstones-1.jpg', '/images/sharpstones-2.jpg'],
     description: `Oxide aluminium sharpening stones <br />
Size: 160*25*6 mm <br />
Grit: 200/400/800/1500`,
    category: 'stones'
  },
  {
    id: 15,
    title: 'Fine-turning adapter',
    price: 4.00,
    images: ['/images/fineadapter-1.jpg', '/images/fineadapter-2.jpg'],
    description: 'The joint allows you to precisely adjust the angle of sharpening the knife. Simple tool for maintaining the chosen sharpening angle. Hole diameter 8 mm.',
    category: 'accessories'
  }
];
