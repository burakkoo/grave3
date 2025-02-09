--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: ActivityType; Type: TYPE; Schema: public; Owner: db_owner
--

CREATE TYPE public."ActivityType" AS ENUM (
    'CREATE_FOLLOW',
    'POST_LIKE',
    'POST_MENTION',
    'CREATE_COMMENT',
    'COMMENT_LIKE',
    'COMMENT_MENTION',
    'CREATE_REPLY',
    'REPLY_LIKE',
    'REPLY_MENTION'
);


ALTER TYPE public."ActivityType" OWNER TO db_owner;

--
-- Name: Gender; Type: TYPE; Schema: public; Owner: db_owner
--

CREATE TYPE public."Gender" AS ENUM (
    'FEMALE',
    'MALE',
    'NONBINARY'
);


ALTER TYPE public."Gender" OWNER TO db_owner;

--
-- Name: RelationshipStatus; Type: TYPE; Schema: public; Owner: db_owner
--

CREATE TYPE public."RelationshipStatus" AS ENUM (
    'SINGLE',
    'IN_A_RELATIONSHIP',
    'ENGAGED',
    'MARRIED'
);


ALTER TYPE public."RelationshipStatus" OWNER TO db_owner;

--
-- Name: VisualMediaType; Type: TYPE; Schema: public; Owner: db_owner
--

CREATE TYPE public."VisualMediaType" AS ENUM (
    'PHOTO',
    'VIDEO'
);


ALTER TYPE public."VisualMediaType" OWNER TO db_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: db_owner
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public."Account" OWNER TO db_owner;

--
-- Name: Activity; Type: TABLE; Schema: public; Owner: db_owner
--

CREATE TABLE public."Activity" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    type public."ActivityType" NOT NULL,
    "sourceId" integer NOT NULL,
    "targetId" integer,
    "sourceUserId" text NOT NULL,
    "targetUserId" text NOT NULL,
    "isNotificationActive" boolean DEFAULT true NOT NULL,
    "isNotificationRead" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Activity" OWNER TO db_owner;

--
-- Name: Activity_id_seq; Type: SEQUENCE; Schema: public; Owner: db_owner
--

CREATE SEQUENCE public."Activity_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Activity_id_seq" OWNER TO db_owner;

--
-- Name: Activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: db_owner
--

ALTER SEQUENCE public."Activity_id_seq" OWNED BY public."Activity".id;


--
-- Name: Comment; Type: TABLE; Schema: public; Owner: db_owner
--

CREATE TABLE public."Comment" (
    id integer NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text,
    "postId" integer NOT NULL,
    "parentId" integer,
    "PostedBy" text,
    "Relation" text
);


ALTER TABLE public."Comment" OWNER TO db_owner;

--
-- Name: CommentLike; Type: TABLE; Schema: public; Owner: db_owner
--

CREATE TABLE public."CommentLike" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text NOT NULL,
    "commentId" integer NOT NULL
);


ALTER TABLE public."CommentLike" OWNER TO db_owner;

--
-- Name: CommentLike_id_seq; Type: SEQUENCE; Schema: public; Owner: db_owner
--

CREATE SEQUENCE public."CommentLike_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CommentLike_id_seq" OWNER TO db_owner;

--
-- Name: CommentLike_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: db_owner
--

ALTER SEQUENCE public."CommentLike_id_seq" OWNED BY public."CommentLike".id;


--
-- Name: Comment_id_seq; Type: SEQUENCE; Schema: public; Owner: db_owner
--

CREATE SEQUENCE public."Comment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Comment_id_seq" OWNER TO db_owner;

--
-- Name: Comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: db_owner
--

ALTER SEQUENCE public."Comment_id_seq" OWNED BY public."Comment".id;


--
-- Name: Follow; Type: TABLE; Schema: public; Owner: db_owner
--

CREATE TABLE public."Follow" (
    id integer NOT NULL,
    "followerId" text NOT NULL,
    "followingId" text NOT NULL
);


ALTER TABLE public."Follow" OWNER TO db_owner;

--
-- Name: Follow_id_seq; Type: SEQUENCE; Schema: public; Owner: db_owner
--

CREATE SEQUENCE public."Follow_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Follow_id_seq" OWNER TO db_owner;

--
-- Name: Follow_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: db_owner
--

ALTER SEQUENCE public."Follow_id_seq" OWNED BY public."Follow".id;


--
-- Name: Post; Type: TABLE; Schema: public; Owner: db_owner
--

CREATE TABLE public."Post" (
    id integer NOT NULL,
    content text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text NOT NULL,
    "PostedBy" text,
    "Relation" text,
    "ApprovalStatus" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Post" OWNER TO db_owner;

--
-- Name: PostLike; Type: TABLE; Schema: public; Owner: db_owner
--

CREATE TABLE public."PostLike" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text NOT NULL,
    "postId" integer NOT NULL
);


ALTER TABLE public."PostLike" OWNER TO db_owner;

--
-- Name: PostLike_id_seq; Type: SEQUENCE; Schema: public; Owner: db_owner
--

CREATE SEQUENCE public."PostLike_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PostLike_id_seq" OWNER TO db_owner;

--
-- Name: PostLike_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: db_owner
--

ALTER SEQUENCE public."PostLike_id_seq" OWNED BY public."PostLike".id;


--
-- Name: Post_id_seq; Type: SEQUENCE; Schema: public; Owner: db_owner
--

CREATE SEQUENCE public."Post_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Post_id_seq" OWNER TO db_owner;

--
-- Name: Post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: db_owner
--

ALTER SEQUENCE public."Post_id_seq" OWNED BY public."Post".id;


--
-- Name: QRCode; Type: TABLE; Schema: public; Owner: db_owner
--

CREATE TABLE public."QRCode" (
    id text NOT NULL,
    code text NOT NULL,
    used boolean DEFAULT false NOT NULL,
    "userId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "activationCode" text DEFAULT ''::text NOT NULL
);


ALTER TABLE public."QRCode" OWNER TO db_owner;

--
-- Name: Session; Type: TABLE; Schema: public; Owner: db_owner
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Session" OWNER TO db_owner;

--
-- Name: User; Type: TABLE; Schema: public; Owner: db_owner
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text,
    email text,
    "emailVerified" timestamp(3) without time zone,
    image text,
    "coverPhoto" text,
    "profilePhoto" text,
    address text,
    bio text,
    "birthDate" timestamp(3) without time zone,
    gender public."Gender",
    "phoneNumber" text,
    "relationshipStatus" public."RelationshipStatus",
    website text,
    username text,
    password text,
    "qrCodeId" text,
    "coverPhotoPositionY" integer DEFAULT 0,
    isadmin boolean DEFAULT false NOT NULL,
    achievements text[],
    "favoriteMovies" text[],
    "favoriteMusic" text[],
    photos text[],
    videos text[],
    "dateOfPassing" timestamp(3) without time zone,
    "facebookLink" text,
    "instagramLink" text,
    "twitterLink" text,
    "wikiLink" text,
    "youtubeLink" text
);


ALTER TABLE public."User" OWNER TO db_owner;

--
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: db_owner
--

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VerificationToken" OWNER TO db_owner;

--
-- Name: VisualMedia; Type: TABLE; Schema: public; Owner: db_owner
--

CREATE TABLE public."VisualMedia" (
    id integer NOT NULL,
    type public."VisualMediaType" DEFAULT 'PHOTO'::public."VisualMediaType" NOT NULL,
    "uploadedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text NOT NULL,
    "postId" integer NOT NULL,
    "fileName" text NOT NULL
);


ALTER TABLE public."VisualMedia" OWNER TO db_owner;

--
-- Name: VisualMedia_id_seq; Type: SEQUENCE; Schema: public; Owner: db_owner
--

CREATE SEQUENCE public."VisualMedia_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."VisualMedia_id_seq" OWNER TO db_owner;

--
-- Name: VisualMedia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: db_owner
--

ALTER SEQUENCE public."VisualMedia_id_seq" OWNED BY public."VisualMedia".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: db_owner
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO db_owner;

--
-- Name: Activity id; Type: DEFAULT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."Activity" ALTER COLUMN id SET DEFAULT nextval('public."Activity_id_seq"'::regclass);


--
-- Name: Comment id; Type: DEFAULT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."Comment" ALTER COLUMN id SET DEFAULT nextval('public."Comment_id_seq"'::regclass);


--
-- Name: CommentLike id; Type: DEFAULT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."CommentLike" ALTER COLUMN id SET DEFAULT nextval('public."CommentLike_id_seq"'::regclass);


--
-- Name: Follow id; Type: DEFAULT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."Follow" ALTER COLUMN id SET DEFAULT nextval('public."Follow_id_seq"'::regclass);


--
-- Name: Post id; Type: DEFAULT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."Post" ALTER COLUMN id SET DEFAULT nextval('public."Post_id_seq"'::regclass);


--
-- Name: PostLike id; Type: DEFAULT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."PostLike" ALTER COLUMN id SET DEFAULT nextval('public."PostLike_id_seq"'::regclass);


--
-- Name: VisualMedia id; Type: DEFAULT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."VisualMedia" ALTER COLUMN id SET DEFAULT nextval('public."VisualMedia_id_seq"'::regclass);


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: db_owner
--

COPY public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: Activity; Type: TABLE DATA; Schema: public; Owner: db_owner
--

COPY public."Activity" (id, "createdAt", type, "sourceId", "targetId", "sourceUserId", "targetUserId", "isNotificationActive", "isNotificationRead") FROM stdin;
19	2024-08-06 19:34:05.356	POST_LIKE	7	10	clzedz3k30000u864wj1elyl5	clzeby9290000wwwsuxmldody	t	f
20	2024-08-07 18:14:37.219	POST_LIKE	8	11	clzedz3k30000u864wj1elyl5	clzedz3k30000u864wj1elyl5	t	f
21	2024-08-07 18:23:28.217	CREATE_COMMENT	7	11	clzedz3k30000u864wj1elyl5	clzedz3k30000u864wj1elyl5	t	f
2	2024-08-03 17:11:04.06	CREATE_FOLLOW	2	\N	clzeby9290000wwwsuxmldody	clzedz3k30000u864wj1elyl5	t	t
22	2024-09-03 08:02:34.221	POST_LIKE	9	12	cm0m54fxp0000jx03lq3ukbb5	cm0m54fxp0000jx03lq3ukbb5	t	f
23	2024-09-03 08:03:05.884	POST_LIKE	10	13	cm0m54fxp0000jx03lq3ukbb5	cm0m54fxp0000jx03lq3ukbb5	t	f
25	2024-09-28 05:06:21.889	CREATE_FOLLOW	6	\N	cm0vahdof0000mj03b3qtpsa3	cm0y5job50000wwsottmwtb5j	t	f
26	2024-11-27 20:29:37.87	POST_LIKE	11	66	cm34k1af60000jp03jcdmh6je	cm34k1af60000jp03jcdmh6je	t	f
5	2024-08-03 17:15:08.912	CREATE_REPLY	2	1	clzeby9290000wwwsuxmldody	clzedz3k30000u864wj1elyl5	t	t
27	2025-01-05 17:09:21.668	POST_LIKE	12	52	cm1xfeesf0000lf0307933g7h	cm0y5job50000wwsottmwtb5j	t	f
6	2024-08-03 17:15:11.177	COMMENT_LIKE	1	1	clzeby9290000wwwsuxmldody	clzedz3k30000u864wj1elyl5	t	t
7	2024-08-03 17:17:34.008	POST_LIKE	2	3	clzeby9290000wwwsuxmldody	clzedz3k30000u864wj1elyl5	t	f
8	2024-08-03 17:19:07.803	CREATE_COMMENT	3	3	clzeby9290000wwwsuxmldody	clzedz3k30000u864wj1elyl5	t	f
10	2024-08-03 17:20:04.306	CREATE_COMMENT	4	6	clzedz3k30000u864wj1elyl5	clzedz3k30000u864wj1elyl5	t	f
28	2025-01-05 17:09:40.907	CREATE_COMMENT	8	46	cm1xfeesf0000lf0307933g7h	cm0y5job50000wwsottmwtb5j	t	f
29	2025-01-05 17:10:10.194	CREATE_REPLY	9	8	cm1xfeesf0000lf0307933g7h	cm1xfeesf0000lf0307933g7h	t	f
30	2025-01-06 01:16:28.604	POST_LIKE	13	71	cm0y5job50000wwsottmwtb5j	cm0y5job50000wwsottmwtb5j	t	f
31	2025-01-06 01:16:30.496	CREATE_COMMENT	10	71	cm0y5job50000wwsottmwtb5j	cm0y5job50000wwsottmwtb5j	t	f
32	2025-01-06 20:23:39.923	CREATE_FOLLOW	7	\N	cm1xfeesf0000lf0307933g7h	cm0y5job50000wwsottmwtb5j	t	f
33	2025-01-06 20:25:31.428	CREATE_COMMENT	11	71	cm1xfeesf0000lf0307933g7h	cm0y5job50000wwsottmwtb5j	t	f
34	2025-01-06 20:25:32.622	CREATE_COMMENT	12	71	cm1xfeesf0000lf0307933g7h	cm0y5job50000wwsottmwtb5j	t	f
14	2024-08-03 17:23:26.857	POST_LIKE	5	6	clzedz3k30000u864wj1elyl5	clzedz3k30000u864wj1elyl5	t	f
11	2024-08-03 17:20:30.336	COMMENT_LIKE	2	4	clzeby9290000wwwsuxmldody	clzedz3k30000u864wj1elyl5	t	t
9	2024-08-03 17:19:52.448	POST_LIKE	3	6	clzeby9290000wwwsuxmldody	clzedz3k30000u864wj1elyl5	t	t
12	2024-08-03 17:20:38.845	CREATE_REPLY	5	4	clzeby9290000wwwsuxmldody	clzedz3k30000u864wj1elyl5	t	t
15	2024-08-04 17:23:35.373	CREATE_COMMENT	6	8	clzeby9290000wwwsuxmldody	clzedz3k30000u864wj1elyl5	t	t
16	2024-08-06 17:30:46.333	CREATE_FOLLOW	3	\N	clzedz3k30000u864wj1elyl5	clzin8e4n0000u8y8of60g54v	t	f
17	2024-08-06 17:30:46.934	CREATE_FOLLOW	4	\N	clzedz3k30000u864wj1elyl5	clzijifvs0000wwl08c3nnzj7	t	f
4	2024-08-03 17:12:46.172	CREATE_COMMENT	1	1	clzedz3k30000u864wj1elyl5	clzeby9290000wwwsuxmldody	t	t
1	2024-08-03 17:09:41.75	CREATE_FOLLOW	1	\N	clzedz3k30000u864wj1elyl5	clzeby9290000wwwsuxmldody	t	t
3	2024-08-03 17:12:41.453	POST_LIKE	1	1	clzedz3k30000u864wj1elyl5	clzeby9290000wwwsuxmldody	t	t
13	2024-08-03 17:22:29.332	POST_LIKE	4	4	clzedz3k30000u864wj1elyl5	clzeby9290000wwwsuxmldody	t	t
18	2024-08-06 17:38:03.763	POST_LIKE	6	11	clzeby9290000wwwsuxmldody	clzedz3k30000u864wj1elyl5	t	f
\.


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: db_owner
--

COPY public."Comment" (id, content, "createdAt", "userId", "postId", "parentId", "PostedBy", "Relation") FROM stdin;
3	pakistani tughe salam	2024-08-03 17:19:05.54	clzeby9290000wwwsuxmldody	3	\N	\N	\N
7	gud	2024-08-07 18:23:26.476	clzedz3k30000u864wj1elyl5	11	\N	\N	\N
8	ggt	2025-01-05 17:09:38.593	cm1xfeesf0000lf0307933g7h	46	\N	\N	\N
9	tt	2025-01-05 17:10:07.971	cm1xfeesf0000lf0307933g7h	46	8	\N	\N
\.


--
-- Data for Name: CommentLike; Type: TABLE DATA; Schema: public; Owner: db_owner
--

COPY public."CommentLike" (id, "createdAt", "userId", "commentId") FROM stdin;
\.


--
-- Data for Name: Follow; Type: TABLE DATA; Schema: public; Owner: db_owner
--

COPY public."Follow" (id, "followerId", "followingId") FROM stdin;
1	clzedz3k30000u864wj1elyl5	clzeby9290000wwwsuxmldody
2	clzeby9290000wwwsuxmldody	clzedz3k30000u864wj1elyl5
3	clzedz3k30000u864wj1elyl5	clzin8e4n0000u8y8of60g54v
4	clzedz3k30000u864wj1elyl5	clzijifvs0000wwl08c3nnzj7
6	cm0vahdof0000mj03b3qtpsa3	cm0y5job50000wwsottmwtb5j
7	cm1xfeesf0000lf0307933g7h	cm0y5job50000wwsottmwtb5j
\.


--
-- Data for Name: Post; Type: TABLE DATA; Schema: public; Owner: db_owner
--

COPY public."Post" (id, content, "createdAt", "userId", "PostedBy", "Relation", "ApprovalStatus") FROM stdin;
3	#NewCoverPhoto	2024-08-03 17:16:37.594	clzedz3k30000u864wj1elyl5	\N	\N	f
9	new town	2024-08-04 17:34:35.345	clzeby9290000wwwsuxmldody	\N	\N	f
10	#NewProfilePhoto	2024-08-06 16:50:32.595	clzeby9290000wwwsuxmldody	\N	\N	f
11	#NewProfilePhoto	2024-08-06 17:29:17.065	clzedz3k30000u864wj1elyl5	\N	\N	f
12	hello	2024-09-03 08:02:25.197	cm0m54fxp0000jx03lq3ukbb5	\N	\N	f
13		2024-09-03 08:02:52.32	cm0m54fxp0000jx03lq3ukbb5	\N	\N	f
14	#NewProfilePhoto	2024-09-03 08:03:30.955	cm0m54fxp0000jx03lq3ukbb5	\N	\N	f
15		2024-09-07 19:01:21.773	cm0qz2umh0000wwt444lvvuh2	\N	\N	f
16	#NewProfilePhoto	2024-09-07 19:02:05.586	cm0qz2umh0000wwt444lvvuh2	\N	\N	f
17	#NewCoverPhoto	2024-09-07 19:02:54.533	cm0qz2umh0000wwt444lvvuh2	\N	\N	f
18	Test post	2024-09-09 17:42:02.734	cm0vahdof0000mj03b3qtpsa3	\N	\N	f
19	test	2024-09-11 17:47:28.111	cm0y5job50000wwsottmwtb5j	\N	\N	f
20	#NewProfilePhoto	2024-09-15 09:16:28.029	cm0y5job50000wwsottmwtb5j	\N	\N	f
37	#NewCoverPhoto	2024-09-15 11:03:05.927	cm0y5job50000wwsottmwtb5j	\N	\N	f
38	#NewCoverPhoto	2024-09-15 15:29:49.384	cm0vahdof0000mj03b3qtpsa3	\N	\N	f
39	wow	2024-09-26 19:16:54.68	cm0y5job50000wwsottmwtb5j	\N	\N	f
41		2024-09-29 12:57:15.495	clzvovzin0000u8ggavpisath	\N	\N	f
42		2024-09-29 12:59:53.851	clzvovzin0000u8ggavpisath	\N	\N	f
45	best friend	2024-09-30 19:30:23.153	cm0y5job50000wwsottmwtb5j	developer	friend	t
44	#NewCoverPhoto	2024-09-30 19:29:07.203	cm0y5job50000wwsottmwtb5j	\N	\N	t
46	test aprrove post	2024-10-01 19:12:03.919	cm0y5job50000wwsottmwtb5j	Dev	Friend	t
47	hello	2024-10-03 11:01:15.828	cm0y5job50000wwsottmwtb5j	areeba	friend	f
48	Hello 	2024-10-03 11:03:06.627	cm1se7a5f0000mh03pmlvt9mo	Areeba	Best friend	t
50	Test	2024-10-04 18:30:48.945	cm1v258p40000ig03waggd9fm	Test	\N	t
53	#NewCoverPhoto	2024-10-06 10:20:04.796	cm1xfeesf0000lf0307933g7h	\N	\N	f
54	#NewProfilePhoto	2024-10-06 10:20:26.354	cm1xfeesf0000lf0307933g7h	\N	\N	f
55	#NewCoverPhoto	2024-10-06 10:20:37.119	cm1xfeesf0000lf0307933g7h	\N	\N	f
56	memory 	2024-10-06 10:24:43.432	cm1xfeesf0000lf0307933g7h	Areeba	Friend	t
57	wow	2024-11-01 15:49:34.695	cm0y5job50000wwsottmwtb5j	soban	dev	f
58	test	2024-11-01 15:50:49.865	cm0y5job50000wwsottmwtb5j	Khizar	Friend	f
59	test 3	2024-11-24 17:50:36.331	cm0y5job50000wwsottmwtb5j	\N	\N	f
60	test 4	2024-11-24 17:53:31.88	cm0y5job50000wwsottmwtb5j	\N	\N	f
62	test 5	2024-11-24 18:10:02.032	cm0y5job50000wwsottmwtb5j	\N	\N	f
66	ddd	2024-11-27 20:29:10.233	cm34k1af60000jp03jcdmh6je	\N	\N	t
65	#NewProfilePhoto	2024-11-27 20:27:26.386	cm34k1af60000jp03jcdmh6je	\N	\N	t
64	#NewCoverPhoto	2024-11-27 20:27:11.44	cm34k1af60000jp03jcdmh6je	\N	\N	t
68	rakko	2025-01-05 23:37:18.467	cm0y5job50000wwsottmwtb5j	\N	\N	f
73	ddd	2025-01-07 13:29:51.828	cm0y5job50000wwsottmwtb5j	dsd	\N	f
\.


--
-- Data for Name: PostLike; Type: TABLE DATA; Schema: public; Owner: db_owner
--

COPY public."PostLike" (id, "createdAt", "userId", "postId") FROM stdin;
2	2024-08-03 17:17:31.975	clzeby9290000wwwsuxmldody	3
6	2024-08-06 17:38:01.722	clzeby9290000wwwsuxmldody	11
7	2024-08-06 19:34:04.325	clzedz3k30000u864wj1elyl5	10
8	2024-08-07 18:14:35.309	clzedz3k30000u864wj1elyl5	11
9	2024-09-03 08:02:32.266	cm0m54fxp0000jx03lq3ukbb5	12
10	2024-09-03 08:03:03.931	cm0m54fxp0000jx03lq3ukbb5	13
11	2024-11-27 20:29:36.009	cm34k1af60000jp03jcdmh6je	66
\.


--
-- Data for Name: QRCode; Type: TABLE DATA; Schema: public; Owner: db_owner
--

COPY public."QRCode" (id, code, used, "userId", "createdAt", "updatedAt", "activationCode") FROM stdin;
cm0crl6xj0005ww4c0xqwkh5x	a763857f-ca19-4637-88db-80487184cee7	t	cm1v258p40000ig03waggd9fm	2024-08-27 18:32:22.61	2024-10-04 18:27:29.858	6321c64b49
cm1v1zxn10009ww3c26vygm8w	691a126f-3949-4371-bf65-623f51576e53	t	cm1xfeesf0000lf0307933g7h	2024-10-04 18:23:20.072	2024-10-06 10:14:05.012	6df7ee2e7c
cm2g3pdo00000wwb4jjmdnt1m	8f9de163-51e9-49cd-bafe-d50f20f51884	f	\N	2024-10-19 11:54:16.429	2024-10-19 11:54:16.429	750b235ce7
cm2g3pdo10001wwb4hk61oh9d	d84799da-94b7-4d2a-a263-7d5a05e52a64	f	\N	2024-10-19 11:54:16.429	2024-10-19 11:54:16.429	1bba7d4177
cm2g3pdo10002wwb4mkuzg6a4	d329fd53-9798-47cb-a39a-2cbf8e726e58	f	\N	2024-10-19 11:54:16.429	2024-10-19 11:54:16.429	762e019f1e
cm2g3pdo10003wwb4on7rixod	a2aaa048-8593-4896-a119-c3d354d61aea	f	\N	2024-10-19 11:54:16.429	2024-10-19 11:54:16.429	ca8e77df86
cm2g3pdo10004wwb4mwy4jsjl	1bc080a1-7efb-4e14-bea1-ae5e6e1a9549	f	\N	2024-10-19 11:54:16.429	2024-10-19 11:54:16.429	4e1970826a
cm2g3pdo10005wwb41xltnxyx	6d3be527-69b8-43bd-9840-78bccd537e1d	f	\N	2024-10-19 11:54:16.429	2024-10-19 11:54:16.429	0c4d2de8f1
cm2g3pdo10006wwb4xbhybzny	1b426fc2-a76c-487a-8847-e26d8a87294b	f	\N	2024-10-19 11:54:16.429	2024-10-19 11:54:16.429	ecca1aec9e
cm2g3pdo10007wwb4dwah2que	f752e799-9c56-4796-a15f-d0c4adfea34d	f	\N	2024-10-19 11:54:16.429	2024-10-19 11:54:16.429	8a43a8a5c0
cm2g3pdo10008wwb4zgna7svn	22f680c4-6f64-4b4d-85e7-8e1181a77d65	f	\N	2024-10-19 11:54:16.429	2024-10-19 11:54:16.429	01e5a53b83
cm2g3pdo10009wwb438ppu15i	5a3dcdae-fed6-4010-a5b8-76f0b5f72178	f	\N	2024-10-19 11:54:16.429	2024-10-19 11:54:16.429	0fcd708937
cm2g3rave000awwb4sgsx096h	518258bf-af5e-4c5d-851c-acd0c90d7929	f	\N	2024-10-19 11:55:46.132	2024-10-19 11:55:46.132	e1d14556c6
cm2g3ravg000bwwb44pu2ab58	341f57f3-171b-4665-81ff-e68b5b394c26	f	\N	2024-10-19 11:55:46.132	2024-10-19 11:55:46.132	cd44e11958
cm2g3ravg000cwwb4emtly1oi	d899ea7b-fbe6-4a0f-9d0f-9c01a16e2073	f	\N	2024-10-19 11:55:46.132	2024-10-19 11:55:46.132	a103313e82
cm0crl6xj0003ww4ck7f1vyrm	ec53cf96-ed55-4751-9aaa-4a8c3affda5a	t	\N	2024-08-27 18:32:22.61	2024-09-06 16:35:30.036	176bb1c0a7
cm2g3ravg000dwwb4sn18n7kk	571ec8bb-fe37-47f2-be66-62e4b96fd498	f	\N	2024-10-19 11:55:46.132	2024-10-19 11:55:46.132	ed10afbefa
cm2g3ravg000ewwb4e806s4yv	3907cab1-02f4-405b-bfed-3b15c1955fc9	f	\N	2024-10-19 11:55:46.132	2024-10-19 11:55:46.132	f1fecb59ac
cm0crl6xi0000ww4csu79e1x3	87edacbd-70c1-4b2c-9983-f6181f3d67fc	t	cm0cs0gc60000wwksr150ta5e	2024-08-27 18:32:22.61	2024-09-06 16:35:25.628	51c7cc0851
cm0crl6xj0001ww4cjnctbkx8	1b7ba1ea-039d-4235-b515-cb545d680496	t	cm0cs518h0001wwks0k7hysbc	2024-08-27 18:32:22.61	2024-09-06 16:35:26.653	438e2a0be3
cm0crl6xk0009ww4c262gpikq	8d3e2b61-0f28-4db2-a28f-62ae02405c8e	t	cm0h0vmlo0000l1030mactgvz	2024-08-27 18:32:22.61	2024-09-06 16:35:27.677	e662f1b0a2
cm0crl6xk0008ww4c2jyi2kg5	73ca3f65-ff5b-44d9-8d2b-2706c5e98e42	t	cm0h1j4ag0000ky03cp0jm9dv	2024-08-27 18:32:22.61	2024-09-06 16:35:29.01	8435800f19
cm0crl6xj0004ww4chi1dse23	68ccffb8-e101-465d-9fd1-c13ffd8ae46e	t	cm0m54fxp0000jx03lq3ukbb5	2024-08-27 18:32:22.61	2024-09-06 16:35:31.055	20974c280d
cm0crl6xk0007ww4cecvhfuvp	43ecb92c-2298-41af-9b49-5d3e3b08e60c	t	cm0qz2umh0000wwt444lvvuh2	2024-08-27 18:32:22.61	2024-09-06 17:10:52.763	c272439b79
cm0crl6xj0002ww4cmaunl9ml	eaad8ce8-27ba-43d1-be79-e013a7ac22c2	t	cm0vahdof0000mj03b3qtpsa3	2024-08-27 18:32:22.61	2024-09-09 17:41:10.795	7152de56e8
cm0crl6xk0006ww4csmyysde3	b86167db-8b85-4ce7-a10a-720920c1db24	t	cm0y5job50000wwsottmwtb5j	2024-08-27 18:32:22.61	2024-09-11 17:46:18.377	bc5285633e
cm1v1zxn00000ww3ckmyxdou5	bab1424d-7317-4ce6-91cb-9e34d673fd56	f	\N	2024-10-04 18:23:20.072	2024-10-04 18:23:20.072	54420d7ba7
cm1v1zxn10001ww3c3eushc9i	caba2069-3584-464b-b5bb-1a296a721cd6	f	\N	2024-10-04 18:23:20.072	2024-10-04 18:23:20.072	3e3add95a5
cm1v1zxn10002ww3cdrj4jibi	45d4646d-02a4-40da-ac19-3180be3b79a7	f	\N	2024-10-04 18:23:20.072	2024-10-04 18:23:20.072	d1f5c59b45
cm1v1zxn10003ww3c73uqf7ul	b8b7e0f0-a1f1-4960-991b-40fd83300caa	f	\N	2024-10-04 18:23:20.072	2024-10-04 18:23:20.072	4f5d7ddd87
cm1v1zxn10004ww3cxzrpxzwk	a0f5996f-9c4a-43c3-81be-e4be46761004	f	\N	2024-10-04 18:23:20.072	2024-10-04 18:23:20.072	0d85dfbe93
cm1v1zxn10005ww3cw7kgvux1	d760c206-3e99-4ee0-bb8c-9054b7010c11	f	\N	2024-10-04 18:23:20.072	2024-10-04 18:23:20.072	7b592446bb
cm1v1zxn10006ww3c0ev9thmy	02414e8f-fed2-42b3-be47-9fa3c7c57c8a	f	\N	2024-10-04 18:23:20.072	2024-10-04 18:23:20.072	78341782fe
cm1v1zxn10007ww3czv55ug22	51a46054-2c8b-4e57-b4a1-e918ca26224b	f	\N	2024-10-04 18:23:20.072	2024-10-04 18:23:20.072	5f401b3587
cm1v1zxn10008ww3c8z1kcq7t	209a1ee8-f4cd-4bd1-9519-7a327be31e36	f	\N	2024-10-04 18:23:20.072	2024-10-04 18:23:20.072	d485c37946
cm2g3ravg000fwwb4uj68qv60	78585ade-fd4b-4bad-908b-e24712ceb702	f	\N	2024-10-19 11:55:46.132	2024-10-19 11:55:46.132	56c1c38a2f
cm2g3ravg000gwwb4gz7aeh2c	765c05ae-8a80-47d6-a210-4715784f82f5	f	\N	2024-10-19 11:55:46.132	2024-10-19 11:55:46.132	4fb961ebf4
cm2g3ravg000hwwb4wc140kx3	1886e7e7-4da8-4490-9281-b773a65dbc92	f	\N	2024-10-19 11:55:46.132	2024-10-19 11:55:46.132	015a192ca4
cm2g3ravg000iwwb4saevfyb9	cc65e6d8-0e29-4973-b392-afe305cf6613	f	\N	2024-10-19 11:55:46.132	2024-10-19 11:55:46.132	4b74528b89
cm2g3ravg000jwwb4bzm4i8jn	18b3e3a2-397f-4cc9-930f-3f12a2267918	f	\N	2024-10-19 11:55:46.132	2024-10-19 11:55:46.132	8606204c2f
cm2hz1xzj0000wwyk3qhqe1c1	3872cf22-e68c-4e5d-be54-e20b74996ac9	f	\N	2024-10-20 19:19:37.037	2024-10-20 19:19:37.037	277630e1a3
cm2hz1xzl0001wwykwata7a0g	698f2777-bc2b-44aa-a2a8-676f4f6e043a	f	\N	2024-10-20 19:19:37.037	2024-10-20 19:19:37.037	263fa91aa0
cm2hz1xzl0002wwykvt4rlebo	add8d2c3-0826-4458-aa2a-5289eb8c20ae	f	\N	2024-10-20 19:19:37.037	2024-10-20 19:19:37.037	4302310329
cm2hz1xzl0003wwykml50uzsl	ff8b9e9d-d8c6-49e9-8053-ce08bc33db4c	f	\N	2024-10-20 19:19:37.037	2024-10-20 19:19:37.037	83a169c458
cm2hz1xzl0004wwyk7rho9so0	58abe952-462f-4c71-9cbe-104f5a2d77cf	f	\N	2024-10-20 19:19:37.037	2024-10-20 19:19:37.037	f40222bb69
cm2hz1xzl0005wwykqva6eiv0	225d3a15-e2db-4bb8-8b79-51eae08b717a	f	\N	2024-10-20 19:19:37.037	2024-10-20 19:19:37.037	d80ab9d9db
cm2hz1xzl0006wwykc6s65hes	a0509351-544b-4113-85e9-a55ceeabb828	f	\N	2024-10-20 19:19:37.037	2024-10-20 19:19:37.037	23ab860929
cm2hz1xzl0007wwyke0nilfto	2566fe05-2f15-4f80-a601-8e7a388681d9	f	\N	2024-10-20 19:19:37.037	2024-10-20 19:19:37.037	b0a36d2dec
cm2hz1xzl0008wwykus9iosra	1d3d9df7-119d-4d08-8e6a-806aeddc5842	f	\N	2024-10-20 19:19:37.037	2024-10-20 19:19:37.037	0bfea985b7
cm2hz1xzl0009wwykazhrt80x	7373ce97-9c21-4f82-bf14-488a28e52e65	f	\N	2024-10-20 19:19:37.037	2024-10-20 19:19:37.037	a5679f99a4
cm2hz55xy000awwykbketda7t	555cc708-01c1-43ab-a3eb-568fc92eeb20	f	\N	2024-10-20 19:22:07.114	2024-10-20 19:22:07.114	b4dfbf5dc1
cm2hz55xz000bwwykzt877qfc	46eb41f0-7b15-4fe3-9a8e-22c3ebc24a51	f	\N	2024-10-20 19:22:07.114	2024-10-20 19:22:07.114	dbc2b5c68c
cm2hz55xz000cwwykuu467qdq	397592c5-4948-4546-9d32-635adbdfa4ac	f	\N	2024-10-20 19:22:07.114	2024-10-20 19:22:07.114	a8ac052435
cm2hz55xz000dwwykpgbbxhl3	ebcc0db9-f0c1-4f84-8332-232daa89fcda	f	\N	2024-10-20 19:22:07.114	2024-10-20 19:22:07.114	2a68f21473
cm2hz55xz000ewwykczq1ktbg	90c61a50-2810-4c4d-b9df-0c771d2aea14	f	\N	2024-10-20 19:22:07.114	2024-10-20 19:22:07.114	0714ffd96f
cm2hz55xz000fwwykmffqszgu	8a2dc712-a37b-48dd-8bd6-cabc47c65e29	f	\N	2024-10-20 19:22:07.114	2024-10-20 19:22:07.114	607f682b60
cm2hz55xz000gwwykgnm6jwfo	407881ab-df1e-42b9-9b93-630676e59425	f	\N	2024-10-20 19:22:07.114	2024-10-20 19:22:07.114	6dec7bab8f
cm2hz55xz000hwwykehxkiefi	66cbe550-ba6f-4286-84c9-afe926204b8e	f	\N	2024-10-20 19:22:07.114	2024-10-20 19:22:07.114	fac0d1c82b
cm2hz55xz000iwwyky0fplson	4923a373-15a8-4b7b-9358-e26ed14507ca	f	\N	2024-10-20 19:22:07.114	2024-10-20 19:22:07.114	4b77d07511
cm2hz55xz000jwwyksbujv1yv	af76c76f-9178-4505-878c-8025c1381a6a	f	\N	2024-10-20 19:22:07.114	2024-10-20 19:22:07.114	ff1d7a30e0
cm4sob4bw0000l1032g5ynurl	ad773ffc-e1e8-4905-b4b1-4df6117b0e2c	f	\N	2024-12-17 16:23:41.996	2024-12-17 16:23:41.996	0e99b72859
cm4sob4bw0001l103022evix7	99cb7344-751b-47bc-befd-07f359249e0a	f	\N	2024-12-17 16:23:41.996	2024-12-17 16:23:41.996	ed01904ab1
cm4sob4bw0002l103l24uekld	675f54b2-b9cf-4469-a59b-90d34ae29483	f	\N	2024-12-17 16:23:41.996	2024-12-17 16:23:41.996	f1d6100e11
cm4sob4bw0003l10380qztdbs	31fd5eab-43e8-4fd8-805e-ddd04e816e96	f	\N	2024-12-17 16:23:41.996	2024-12-17 16:23:41.996	0b714436aa
cm4sob4bw0004l103aj7q2m0d	929b77ed-ec2a-4bf7-bd3a-d8b529d859e2	f	\N	2024-12-17 16:23:41.996	2024-12-17 16:23:41.996	96f8d18d1b
cm4sob4bw0005l103vu3k2855	5863a405-41c0-4337-8c35-ce6d57ebc598	f	\N	2024-12-17 16:23:41.996	2024-12-17 16:23:41.996	f0c9f818ce
cm4sob4bw0006l103zgrpdv43	6ae8e02b-ef11-49be-bf05-afdce1be844f	f	\N	2024-12-17 16:23:41.996	2024-12-17 16:23:41.996	6006ec68d4
cm4sob4bw0007l103nhk0pzkl	d309c203-0c1f-4645-a9e3-57837c7879b8	f	\N	2024-12-17 16:23:41.996	2024-12-17 16:23:41.996	fbb35c58b1
cm4sob4bw0008l103w0o902im	e5095f1b-d551-4075-afcb-a31ec386d3e1	f	\N	2024-12-17 16:23:41.996	2024-12-17 16:23:41.996	f9711e681a
cm4sob4bw0009l103mxmwkkfh	69b5db0f-3437-42b4-8e1a-ba37c129f757	f	\N	2024-12-17 16:23:41.996	2024-12-17 16:23:41.996	1b895a74e8
cm4sobaty000al103t42hheu5	cda61682-b2e7-4e54-a8e6-f6a1492dfe93	f	\N	2024-12-17 16:23:50.423	2024-12-17 16:23:50.423	b7d51cda89
cm4sobaty000bl103chgyikca	aeb09d8d-d54c-451a-8859-1b201a7b44fe	f	\N	2024-12-17 16:23:50.423	2024-12-17 16:23:50.423	b489ca8541
cm4sobaty000cl103v12m9tb1	54d115b2-75ea-4924-b017-59163f2d84dd	f	\N	2024-12-17 16:23:50.423	2024-12-17 16:23:50.423	1806de525e
cm4sobaty000dl1035hcpka28	722c1292-cb1c-4ce3-8961-b6710ad0afb4	f	\N	2024-12-17 16:23:50.423	2024-12-17 16:23:50.423	3ec2e71063
cm4sobaty000el1036xl8c2nt	c24ee1a8-2495-4bae-acb0-16a835769407	f	\N	2024-12-17 16:23:50.423	2024-12-17 16:23:50.423	588d9c8059
cm4sobaty000fl10301jsex09	08dc1321-16e7-479b-a52c-52dd0ed90426	f	\N	2024-12-17 16:23:50.423	2024-12-17 16:23:50.423	2013d714f7
cm4sobaty000gl1030t3voedo	e2690307-7d0b-4eab-ba93-67d81804da94	f	\N	2024-12-17 16:23:50.423	2024-12-17 16:23:50.423	6fccf3b429
cm4sobaty000hl103wzq9mt6w	bcd4252e-f5ea-4b36-84f0-a83064f19a0d	f	\N	2024-12-17 16:23:50.423	2024-12-17 16:23:50.423	9b729a0b18
cm4sobaty000il103qckipr90	dc560c51-eaf8-4512-aa22-9b8fcf5ec93f	f	\N	2024-12-17 16:23:50.423	2024-12-17 16:23:50.423	4797ecfa5c
cm4sobaty000jl103frpjrtjm	5c627558-30f7-415d-96f5-8ff3e8891dcc	f	\N	2024-12-17 16:23:50.423	2024-12-17 16:23:50.423	0ed73d9482
cm4sobliu000kl103e1ympmzo	ffc8e063-2272-47e7-a3be-f2d75cfc4808	f	\N	2024-12-17 16:24:04.062	2024-12-17 16:24:04.062	816d971a20
cm4sobliu000ll103wvnzwibx	84fcac7b-6550-4da0-9439-b87f106b4c1e	f	\N	2024-12-17 16:24:04.062	2024-12-17 16:24:04.062	38bbf131c3
cm4sobliu000ml1037h2vmucb	235ab1a5-accc-45db-9723-60bd732ed4c8	f	\N	2024-12-17 16:24:04.062	2024-12-17 16:24:04.062	cccf3ec665
cm4sobliu000nl103uqj5h5y7	eccaae63-b888-4896-a920-bc7a6793b449	f	\N	2024-12-17 16:24:04.062	2024-12-17 16:24:04.062	e9ec0d87e3
cm4sobliu000ol103pg63fkyj	c20695f7-76fe-4e30-90d1-8fa6c52b6c54	f	\N	2024-12-17 16:24:04.062	2024-12-17 16:24:04.062	32d9ac1ae3
cm4sobliu000pl1034tt312wh	5d167c18-235e-43c8-b451-8c9cbd922aa5	f	\N	2024-12-17 16:24:04.062	2024-12-17 16:24:04.062	ff5125250b
cm4sobliu000ql103j9s3x3b6	c758749a-d6fa-4acf-9415-b11525bdb962	f	\N	2024-12-17 16:24:04.062	2024-12-17 16:24:04.062	c48c58f69a
cm4sobliu000rl103mmhrpi2d	edb15b3f-226f-42e1-a890-51b05e994582	f	\N	2024-12-17 16:24:04.062	2024-12-17 16:24:04.062	a743f0d368
cm4sobliu000sl103ys14foes	a463583c-96b7-439e-84e1-f8674f2560c8	f	\N	2024-12-17 16:24:04.062	2024-12-17 16:24:04.062	adbb8e865e
cm4sobliu000tl103rk4yq4ts	0a2d7da6-5a58-4866-ac47-815f6ba64cca	f	\N	2024-12-17 16:24:04.062	2024-12-17 16:24:04.062	e6e5d399fc
cm53z0ah90000wwi4frwcxb0m	2cb8413e-152c-4704-9c35-b7bd6a67303e	f	\N	2024-12-25 14:08:40.456	2024-12-25 14:08:40.456	755419b795
cm53z0ahb0001wwi413evfj22	88d5f558-5fc3-4298-9731-f6b7cc8879dd	f	\N	2024-12-25 14:08:40.456	2024-12-25 14:08:40.456	5b97b58abc
cm53z0ahb0002wwi4vbbu4lia	63d448c7-da4a-4ead-9f9e-de539e2c5bdb	f	\N	2024-12-25 14:08:40.456	2024-12-25 14:08:40.456	fb75f308fe
cm53z0ahb0003wwi457vf99j4	16b0aba2-215f-4a0c-b394-851e5b0368eb	f	\N	2024-12-25 14:08:40.456	2024-12-25 14:08:40.456	b0cbddf35d
cm53z0ahb0004wwi44i5m01ic	ec218dd8-6029-4759-ba71-1231df79af0f	f	\N	2024-12-25 14:08:40.456	2024-12-25 14:08:40.456	de95122dbe
cm53z0ahb0005wwi4gkwwth5a	0010947f-4344-4065-bf4d-28bd4030747f	f	\N	2024-12-25 14:08:40.456	2024-12-25 14:08:40.456	dff3ec9825
cm53z0ahb0006wwi4zmfba3jg	076d219f-27af-4a19-960a-2c4f34988f96	f	\N	2024-12-25 14:08:40.456	2024-12-25 14:08:40.456	c50693ccab
cm53z0ahb0007wwi4rllhn8ps	b51149f8-7f90-47da-8d22-0d614f7383c3	f	\N	2024-12-25 14:08:40.456	2024-12-25 14:08:40.456	3371875096
cm53z0ahb0008wwi49tibf4a4	0ee941e7-8f8f-4209-b67d-47974c244f2a	f	\N	2024-12-25 14:08:40.456	2024-12-25 14:08:40.456	7eff7e75e7
cm53z0ahb0009wwi46f4nctd3	60ab305d-a231-41b7-a649-8fd2ec0089bb	f	\N	2024-12-25 14:08:40.456	2024-12-25 14:08:40.456	f961d9656a
cm56ukbz20000jy03mhrh9aq6	65458480-1f62-4483-a143-97cc2f0dd566	f	\N	2024-12-27 14:27:35.728	2024-12-27 14:27:35.728	64f0904f35
cm56ukbz20001jy031frvpaze	d9a9e951-1dff-4751-b4bf-de1e6a845f17	f	\N	2024-12-27 14:27:35.728	2024-12-27 14:27:35.728	e006c72588
cm56ukbz20002jy03khszly65	29d3b29f-ca74-416a-8b6a-7416088e07d4	f	\N	2024-12-27 14:27:35.728	2024-12-27 14:27:35.728	50330a4f22
cm56ukbz20003jy03vitt27ni	faf6bb68-c87d-49de-974c-7a54747232e2	f	\N	2024-12-27 14:27:35.728	2024-12-27 14:27:35.728	f804027565
cm56ukbz20004jy031cb2gv74	9073a90d-fb0c-45a7-ab8a-78561a271b29	f	\N	2024-12-27 14:27:35.728	2024-12-27 14:27:35.728	11735ea8e0
cm56ukbz20005jy03ugvg1pxp	c1c88597-7e52-47f5-8624-83eee6e43069	f	\N	2024-12-27 14:27:35.728	2024-12-27 14:27:35.728	a7899af297
cm56ukbz20006jy03s0ouq2wk	83bfe4a4-5464-4986-bc48-53ee3cb59d58	f	\N	2024-12-27 14:27:35.728	2024-12-27 14:27:35.728	2978716e87
cm56ukbz20007jy03jkqf9pbr	42718a17-7106-488a-987a-322e61c65c06	f	\N	2024-12-27 14:27:35.728	2024-12-27 14:27:35.728	1d92d8ec7c
cm56ukbz20008jy03o7hgbcb9	b5bd907e-7f6f-469a-a307-a311d14818d4	f	\N	2024-12-27 14:27:35.728	2024-12-27 14:27:35.728	5114853296
cm56ukbz30009jy03cj98al2y	60760f18-185f-4b5b-aba7-9b84880d500c	f	\N	2024-12-27 14:27:35.728	2024-12-27 14:27:35.728	1240dd7a5f
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: db_owner
--

COPY public."Session" (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: db_owner
--

COPY public."User" (id, name, email, "emailVerified", image, "coverPhoto", "profilePhoto", address, bio, "birthDate", gender, "phoneNumber", "relationshipStatus", website, username, password, "qrCodeId", "coverPhotoPositionY", isadmin, achievements, "favoriteMovies", "favoriteMusic", photos, videos, "dateOfPassing", "facebookLink", "instagramLink", "twitterLink", "wikiLink", "youtubeLink") FROM stdin;
cm0h0vmlo0000l1030mactgvz	Shaya	shayan@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	cm0h0vmlo0000l1030mactgvz	$2b$10$gFy1wPiWJPqyttYarucvXuUlV6ay.kTprvYEW5QeFm4k5OGdZXpci	\N	0	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cm0h1j4ag0000ky03cp0jm9dv	areev	areeba@gmail.com	\N	\N	\N	\N	vhjk	fhkk	\N	\N	35789	\N	\N	cm0h1j4ag0000ky03cp0jm9dv	$2b$10$EjXhRssm3tCA7uVW3pCl1eIm2Y8j3gBMIPrk6gPcDtkzC4JtqaVka	\N	0	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cm0j935fo0000l40308hjnc36	shaya	shayaan@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	cm0j935fo0000l40308hjnc36	$2b$10$Rgw/RUwor0raTzbpCqRkh.H6sYSagcuvWRod78x2DWiXyNM2Z0ixO	\N	0	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
clzijifvs0000wwl08c3nnzj7	test	soban.scf@hotmail.com	2024-08-06 14:53:12.03	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	clzijifvs0000wwl08c3nnzj7	\N	\N	0	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
clzin8e4n0000u8y8of60g54v	shayaan	shayaanwaseem2803@gmail.com	2024-08-06 16:37:21.647	\N	\N	\N	\N	\N	\N	\N	03039502203	\N	\N	clzin8e4n0000u8y8of60g54v	\N	\N	0	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cm0m54fxp0000jx03lq3ukbb5	areeba	areeba.waseem@nu.edu.pk	\N	\N	\N	1725350607797-9cf1627b-2cd3-405f-ab0a-e06e6fd140ac.jpeg	fsd	\N	2001-01-14 00:00:00	FEMALE	03316114199	SINGLE	\N	cm0m54fxp0000jx03lq3ukbb5	$2b$10$mHkCAAP0kKAdJzhyA0YlaeEKfL70DVoyfbowDMQW3ltkrZ0L3NcXS	\N	0	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
clzr9mefz0000wwi0nhv9mdhn	test	a@a.com	2024-08-12 17:26:16.218	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	clzr9mefz0000wwi0nhv9mdhn	\N	\N	0	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
clzvl52cn0001wwmstbk1f5cw	test	s@a.com	2024-08-15 17:59:47.49	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	clzvl52cn0001wwmstbk1f5cw	\N	\N	0	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
clzvlavuy0002wwmsxp8bb8sq	shhd	s@b.com	2024-08-15 18:14:39.355	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	clzvlavuy0002wwmsxp8bb8sq	\N	\N	0	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
clzvkiz2f0000wwms8cdfxtvb	test	s@s.com	2024-08-15 18:17:56.034	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	clzvkiz2f0000wwms8cdfxtvb	\N	\N	0	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
clzvltvys0000wwzswo6yfyhv	wee	s@d.com	2024-08-15 18:19:05.611	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	clzvltvys0000wwzswo6yfyhv	\N	\N	0	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
clzvovzin0000u8ggavpisath	shayaan	s@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	clzvovzin0000u8ggavpisath	$2b$10$6dDLtv9Pib04lnN13eMQGu8DCzXeG5VT6VALP5U.g6zOdlig30v1y	\N	0	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cm0cs0gc60000wwksr150ta5e	abc	abc@email.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	cm0cs0gc60000wwksr150ta5e	$2b$10$zXQqWb.4F/slrlr4QFW0tOfQa7jCWrvaXkcRAfn7EXAojR.tXnuP.	\N	0	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cm0cs518h0001wwks0k7hysbc	testuser	abcd@email.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	testuser	$2b$10$JA9d78cDTl2SOdbn0vQjEem0R7.BllLFCIyXWsWibEAhhcMHXYGL2	\N	0	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cm34k1af60000jp03jcdmh6je	burakko	burak555@hotmail.com	\N	\N	1732739228545-73d62fe4-b6fc-4fc0-bc4b-dca90e00bd04.jpeg	1732739243886-84de9006-bf60-410b-aa4d-f275a3b9023a.jpeg	\N	\N	1985-01-05 00:00:00	MALE	\N	SINGLE	http://www.google.com	cm34k1af60000jp03jcdmh6je	$2b$10$c476p2kqLbD3fhj1xwvlBuTprE9BoycZBFtyVK/AQ60JMR4w2g0FC	\N	0	f	{lallalal,laallalddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd}	{eewdasd}	{ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd,https://open.spotify.com/playlist/37i9dQZF1DZ06evO45P0Eo?si=s-LWt-wHSByaksmOBzIjMA}	{"https://memoria-graveapp.s3.amazonaws.com/1732658621496_WhatsApp Image 2024-10-28 at 19.17.50_45e5fd64.jpg"}	{}	1985-01-05 00:00:00	\N	\N	\N	\N	\N
clzeby9290000wwwsuxmldody	dev 1	soban.scf@gmail.com	2024-08-06 16:45:46.969	\N	\N	1722963028612-772056db-10cd-4212-9430-33ba7da83855.jpeg	\N	He was so awesome!!!	\N	\N	\N	\N	\N	dev_1	$2b$10$KNbiKW383YrV5oM.e10v1OZ02gDnbQS.mng/loEtAQJeTzcqGzNhK	\N	0	t	{wow,hello}	{}	{}	{}	{}	\N	https://www.facebook.com/harley-davidson	https://www.instagram.com/harleydavidson/	\N	https://en.wikipedia.org/wiki/Harley-Davidson	https://youtu.be/a3ICNMQW7Ok?si=umWLsoHMy4ZhDG0O
cm0vahdof0000mj03b3qtpsa3	John	test123@gmail.com	\N	\N	1726414186742-0a7a48fb-c525-468b-be1b-1e324b245430.jpeg	\N	\N	\N	\N	\N	\N	\N	\N	test123	$2b$10$m9B2.uvfcVDM5U3Kp1v4ZeiVDbjP6rNuSuhf7Qi3KcbOiSy2R88OW	\N	-83	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cm0qz2umh0000wwt444lvvuh2	Awesome	test@test.com	\N	\N	1725735757086-a41eb1f3-3713-42c1-9573-86906d9cbeac.png	1725735721932-0a4f36f1-4e0f-46f5-b4e8-30991803d57a.png	\N	\N	\N	\N	\N	\N	\N	Awesomeuser	$2b$10$GP7nZ4fGd3NOZt/AUbjIpOKPL6A2/uvb.J8wrfWBb5OFq2P/alWV2	\N	0	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
clzedz3k30000u864wj1elyl5	DEV_2	hehee@123.com	2024-08-15 19:15:23.747	\N	1722705392653-019911a6-e421-48ae-a21e-b4fb7a5564d4.jpeg	1722965354801-6465516d-8cab-47c6-b1a6-d68ec6e22eec.jpeg	\N	\N	\N	\N	\N	\N	\N	DEV_2	$2b$10$KNbiKW383YrV5oM.e10v1OZ02gDnbQS.mng/loEtAQJeTzcqGzNhK	\N	0	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cm1se7a5f0000mh03pmlvt9mo	burak demirel	test@hotmail.com	\N	\N	\N	\N	Meerkoet 283	dddd	1985-12-05 00:00:00	MALE	0654734548	ENGAGED	www.ddd.com	cm1se7a5f0000mh03pmlvt9mo	$2b$10$sso5MLVvDaoytqQoKxvV9evDJXs.5wdOhM.CB7admFDh5AXjFr.LO	\N	0	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cm1v258p40000ig03waggd9fm	Shaya	test@p.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	cm1v258p40000ig03waggd9fm	$2b$10$AxkdsBWTmwT9/s2hLBdTNefDqKWGVQqR9/JoSbK9C8SoHupqD533O	\N	0	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cm1xfeesf0000lf0307933g7h	Leai	burak555@gmail.com	\N	\N	1728210034985-8fb56146-2c2c-4738-ac50-71919fd015ac.jpeg	1728210024045-3b212538-423a-4b5c-9428-e953ee5d661a.jpeg	jsjsjsjs	jsjsjsnsnsnnsnsndndnsnsnsnsnsnsnsnnsnsnsnsnsnsnsnsnns	1985-01-05 00:00:00	MALE	73737373	MARRIED	hsjsjsj.com	cm1xfeesf0000lf0307933g7h	$2b$10$TOPJOEhjTi.xp..74.p0T.GFr5SDOCDF/7dPUw7kiUMgE3A7ddfz2	\N	0	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cm0y5job50000wwsottmwtb5j	William Sylvester Harley	soban@hotmail.com	\N	\N	1727724543734-959a2f66-0795-4cef-ad0e-35a1c7fd4eb2.jpeg	1726391785250-e0e84e4f-0a92-4444-834f-942d8a30f9b2.jpeg	\N	\N	1990-04-04 00:00:00	\N	\N	\N	\N	harleydavid123	$2b$10$aA6NfTp2vGjw0yhwU5dTGeebGNehrd6UBvNrQWl3PNcHcNxWBEgUW	\N	-94	t	{"Graduated with honors in Computer Science","Published a book on modern programming practices","Volunteered for numerous community service projects"}	{Move,Joker}	{song,song1,https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM?si=f2c03a686fe24eda}	{}	{https://memoria-graveapp.s3.amazonaws.com/1732648541033_big_buck_bunny_720p_1mb.mp4}	2024-09-09 00:00:00	\N	\N	\N	\N	\N
\.


--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: db_owner
--

COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
a@a.com	857a31a57015270481501bcac62b709f8b0e3276745d1b531a65c7a230f22669	2024-08-04 17:26:38.689
soban.scf@gmail.com	855d4998fbc20b48d8d329e62826a4bfab060d0e7dd12b8de424220c1f4aa74f	2024-08-13 22:15:31.668
s@d.com	9adce66f910919e6c18dcfdbf9670d0255b88d870fd6b8ed6ea347f150ce64cc	2024-08-16 18:18:17.255
\.


--
-- Data for Name: VisualMedia; Type: TABLE DATA; Schema: public; Owner: db_owner
--

COPY public."VisualMedia" (id, type, "uploadedAt", "userId", "postId", "fileName") FROM stdin;
3	PHOTO	2024-08-03 17:16:37.594	clzedz3k30000u864wj1elyl5	3	1722705392653-019911a6-e421-48ae-a21e-b4fb7a5564d4.jpeg
8	VIDEO	2024-08-06 16:46:54.203	clzeby9290000wwwsuxmldody	9	1722792865177-f5d0e830-b453-47a8-b830-b4cfdf34a074.mp4
9	PHOTO	2024-08-06 16:50:32.595	clzeby9290000wwwsuxmldody	10	1722963028612-772056db-10cd-4212-9430-33ba7da83855.jpeg
10	PHOTO	2024-08-06 17:29:17.065	clzedz3k30000u864wj1elyl5	11	1722965354801-6465516d-8cab-47c6-b1a6-d68ec6e22eec.jpeg
11	PHOTO	2024-09-03 08:02:52.32	cm0m54fxp0000jx03lq3ukbb5	13	1725350569511-32b5b955-ee7c-4676-a119-113c9271b082.jpeg
12	PHOTO	2024-09-03 08:03:30.955	cm0m54fxp0000jx03lq3ukbb5	14	1725350607797-9cf1627b-2cd3-405f-ab0a-e06e6fd140ac.jpeg
13	PHOTO	2024-09-07 19:01:21.773	cm0qz2umh0000wwt444lvvuh2	15	1725735680318-d78b58c1-f48e-4970-a6d7-d8c02bc3cf93.png
14	PHOTO	2024-09-07 19:02:05.586	cm0qz2umh0000wwt444lvvuh2	16	1725735721932-0a4f36f1-4e0f-46f5-b4e8-30991803d57a.png
15	PHOTO	2024-09-07 19:02:54.533	cm0qz2umh0000wwt444lvvuh2	17	1725735757086-a41eb1f3-3713-42c1-9573-86906d9cbeac.png
16	PHOTO	2024-09-09 17:42:02.734	cm0vahdof0000mj03b3qtpsa3	18	1725903721955-cd10414d-c521-4629-90be-09986d4b734e.png
17	PHOTO	2024-09-11 17:47:28.111	cm0y5job50000wwsottmwtb5j	19	1726076847091-2702d64f-a3f0-4fa9-9a50-e9f04141a8a1.png
18	PHOTO	2024-09-15 09:16:28.029	cm0y5job50000wwsottmwtb5j	20	1726391785250-e0e84e4f-0a92-4444-834f-942d8a30f9b2.jpeg
35	PHOTO	2024-09-15 11:03:05.927	cm0y5job50000wwsottmwtb5j	37	1726398183298-d0e2180a-4199-4ff5-a812-98921289b79f.jpeg
36	PHOTO	2024-09-15 15:29:49.384	cm0vahdof0000mj03b3qtpsa3	38	1726414186742-0a7a48fb-c525-468b-be1b-1e324b245430.jpeg
37	PHOTO	2024-09-26 19:16:54.68	cm0y5job50000wwsottmwtb5j	39	1727378213051-4e8a5ea0-08e4-4e70-bb9d-1344c72212e0.jpeg
38	PHOTO	2024-09-26 19:16:54.68	cm0y5job50000wwsottmwtb5j	39	1727378213044-182a8e03-3e29-4455-8b2d-4c74afdade32.jpeg
41	PHOTO	2024-09-29 12:57:15.495	clzvovzin0000u8ggavpisath	41	1727614620990-9b88698e-168f-41f1-b28a-e1a5c2c1e37d.png
42	PHOTO	2024-09-29 12:59:53.851	clzvovzin0000u8ggavpisath	42	1727614778968-b94ec80b-15ee-4a17-af1d-306edf053e40.jpeg
44	PHOTO	2024-09-30 19:29:07.203	cm0y5job50000wwsottmwtb5j	44	1727724543734-959a2f66-0795-4cef-ad0e-35a1c7fd4eb2.jpeg
45	PHOTO	2024-09-30 19:30:23.153	cm0y5job50000wwsottmwtb5j	45	1727724621157-9d8ea226-1c0b-40d4-80c7-332ce5e3f463.jpeg
46	PHOTO	2024-10-01 19:12:03.919	cm0y5job50000wwsottmwtb5j	46	1727809922534-b5f51f04-5301-446a-8b40-d4136dc289ef.jpeg
48	PHOTO	2024-10-04 18:30:48.945	cm1v258p40000ig03waggd9fm	50	1728066647380-db2cc2b4-314d-4314-bc80-3b883fe14b46.jpeg
49	PHOTO	2024-10-06 10:20:04.796	cm1xfeesf0000lf0307933g7h	53	1728210002463-00c4f177-24a3-4716-8bdd-847566f3cd25.jpeg
50	PHOTO	2024-10-06 10:20:26.354	cm1xfeesf0000lf0307933g7h	54	1728210024045-3b212538-423a-4b5c-9428-e953ee5d661a.jpeg
51	PHOTO	2024-10-06 10:20:37.119	cm1xfeesf0000lf0307933g7h	55	1728210034985-8fb56146-2c2c-4738-ac50-71919fd015ac.jpeg
52	PHOTO	2024-10-06 10:24:43.432	cm1xfeesf0000lf0307933g7h	56	1728210281936-4f69caa0-81bd-4faf-866f-2262a2becf8f.jpeg
53	PHOTO	2024-11-27 20:27:11.44	cm34k1af60000jp03jcdmh6je	64	1732739228545-73d62fe4-b6fc-4fc0-bc4b-dca90e00bd04.jpeg
54	PHOTO	2024-11-27 20:27:26.386	cm34k1af60000jp03jcdmh6je	65	1732739243886-84de9006-bf60-410b-aa4d-f275a3b9023a.jpeg
56	PHOTO	2025-01-05 23:37:18.467	cm0y5job50000wwsottmwtb5j	68	1736120237838-9a64a8d6-ec97-4ca0-8cc7-6c2c0e2775c7.png
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: db_owner
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
84213c96-4552-4133-81d0-1b1eb89a5bbc	1ba2eb7d70735acbcda8858667d82f31cbccc3e067b410d38dfded77a4a017d8	2024-08-03 15:56:11.133565+00	20230705115444_add_about_model	\N	\N	2024-08-03 15:56:10.111127+00	1
f0be2b12-2cf0-40ac-a638-38ad608432cf	79c960180317990843687a89bb2776d5f5858a2f9b000f06cb53b6d703be6fb4	2024-08-03 15:55:52.179449+00	20230602132104_init	\N	\N	2024-08-03 15:55:51.084197+00	1
716a7f7d-454f-4cef-a300-b4e54f687d4e	576b12317663663e286d7fbd15591211bf8488f81eabb0b5e5844984a9831964	2024-08-03 15:55:53.60702+00	20230607151635_add_handle_field_to_user_model	\N	\N	2024-08-03 15:55:52.589218+00	1
2275bdeb-cb1f-4320-9c5a-848b7e9dc511	f01ea62d48784b1cc63d1f35a7f5225103ee69c894584233c13107bddbbdf99a	2024-08-03 15:56:22.962299+00	20230813142002_	\N	\N	2024-08-03 15:56:21.930373+00	1
d1c3fe59-0d84-4f1d-8f4e-58cc0a325bb1	8d7f70fdf926f9cbec881aab2b9c655ea222eb60064080b32f5ceb52ba57a87e	2024-08-03 15:55:55.774885+00	20230613144137_update	\N	\N	2024-08-03 15:55:54.725033+00	1
eccc81fb-405b-4885-aa4a-0a3407a8fc32	0e89cbbf69736698ef275f43a7e65ae1ae4c301639d8048e0caba6de79b7b898	2024-08-03 15:56:12.566158+00	20230705132756_removed_about_model_moved_fields_to_user_model	\N	\N	2024-08-03 15:56:11.542116+00	1
b2523ffc-ca98-4cc5-9cc8-39132bcb10bb	3493002d8fae00f293e937ef29e32a13737cb61d6d118cae5bed133fff327f74	2024-08-03 15:55:57.288705+00	20230617132708_add_post_like_comment_models	\N	\N	2024-08-03 15:55:56.195216+00	1
2ee4fce7-a3bf-4858-943d-bf9897172021	d2eacfc69fe4926bb9ed40da93efdd675bfbfd71c4f8976321de452f34bfa43e	2024-08-03 15:55:58.723328+00	20230619144839_removed_photos_model_added_visual_media_which_includes_both_photos_and_videos	\N	\N	2024-08-03 15:55:57.696347+00	1
67d75cf6-847b-43cf-80b2-bc76c965915a	0a4489ef2de14d05d631c02ae8aa7c1ce37c055bba4833c7db26a335b2d690f5	2024-08-03 15:56:00.195636+00	20230627142509_add_compound_unique_constraint_to_post_like_model_on_user_id_and_post_id_to_make_sure_that_no_user_can_like_the_same_post_twice	\N	\N	2024-08-03 15:55:59.13381+00	1
35c24371-4aab-4b4d-b599-4cdf6f0cce10	dfa8e2d32811593af9cb1bfdc85a621becb1cbc6edfd76b803f734421bf81d6c	2024-08-03 15:56:14.020788+00	20230711042853_add_username_to_user_model	\N	\N	2024-08-03 15:56:12.987229+00	1
0cc68e88-0582-4516-890f-16c59b7a0972	d88176044ff5231ac0b3a9420888dd62e25126f815e8787e88528c9f4bb61579	2024-08-03 15:56:01.617387+00	20230627183540_added_id_to_postlike_composite_unique_constraint	\N	\N	2024-08-03 15:56:00.60615+00	1
f71116d3-9606-476b-bec7-b8d87f3799e0	a5178b3f8a9a4e389f630a05edca945f29bcebc5a6fa37dfbadfd758d74176b6	2024-08-03 15:56:03.481841+00	20230628023751_	\N	\N	2024-08-03 15:56:02.024085+00	1
886b52ba-ceb2-47c6-9443-29fe76f00176	ab80a534dfa4779eeae4ae5aeac192eea19b283671d6083c8f112e3c8a4229df	2024-08-15 18:38:15.027031+00	20240815183812_add_password_field	\N	\N	2024-08-15 18:38:14.004199+00	1
dd4f88df-7d27-4f91-b13e-2562cc5597f3	d8556dcc39ad2542981a978ba0c095cb5237a63bd68c474c238f96d62017fdeb	2024-08-03 15:56:05.324173+00	20230628030903_	\N	\N	2024-08-03 15:56:03.891842+00	1
c6d9ea41-c1f4-4a03-8f97-8e9f86cede04	fc620fc2f344aa3c75116fb15c5fbec1329edd3fe5510bd19857b449e2065d98	2024-08-03 15:56:15.528189+00	20230711165949_	\N	\N	2024-08-03 15:56:14.49537+00	1
264eee88-0849-48dd-97f2-d9d9b51b135b	80047e677e17f4856234ffd1cd57defb4efc7e050f7a081a3b3f0fe578a821bb	2024-08-03 15:56:06.804359+00	20230628031049_y	\N	\N	2024-08-03 15:56:05.740068+00	1
d619031c-735d-48f4-be3f-56ce27017930	f740ab2b9ca6ae4be1d4feb7fddc23ae60a24d42a1be449ff6eae37360f1bcd5	2024-08-03 15:56:08.281215+00	20230628165713_	\N	\N	2024-08-03 15:56:07.210211+00	1
af1acd68-4ba8-4298-a88c-e41f31265ef7	f8ea61eabba3a722e432b1155e713b44f4089ebc1e21cd9da01c85e41b9f0dc6	2024-08-03 15:56:24.431036+00	20230815153356_	\N	\N	2024-08-03 15:56:23.373023+00	1
58caf7d9-2ca1-4fb7-8574-4603f5241130	a197cbd62f048303371ad41e5ff5495152d97233145e6062cf2814ff03f1f97c	2024-08-03 15:56:09.698143+00	20230629030750_	\N	\N	2024-08-03 15:56:08.691349+00	1
2f6e23f8-f336-4d92-b6f3-9bb52be002a8	c328f3a5efe970948ef9c5d4fd12158490fb91f185f3d947f9164fb4e7fdacd3	2024-08-03 15:56:17.057445+00	20230711174511_removed_unnecessary_composite_constraints_of_post_and_comment	\N	\N	2024-08-03 15:56:16.037123+00	1
b8b8abf7-ce58-4a37-b0a1-5c8b8a096f0e	16aaf91cca26f089ca4dc51e096ef190b640345bd5f9021fb7d7eb11b2dd43f9	2024-08-03 15:56:18.564876+00	20230712101108_aded_follow_model	\N	\N	2024-08-03 15:56:17.469595+00	1
b0e991d7-21b2-4c1b-822f-028ac148f487	0ce5314c5e85efb02816d28f4a8b9afeea3decc840710f626cfea0c5d1d5d09c	2024-08-03 15:56:25.855941+00	20230816075955_	\N	\N	2024-08-03 15:56:24.841738+00	1
a0bc86f9-ce97-4547-984d-2894b57f4a6a	e469e5d889de1fc88f94f0ef7d432b63f6e6ad008b9683048351e4ce1905a861	2024-08-03 15:56:20.019884+00	20230728103319_added_self_referential_relation_to_comment_and_added_commentlike_model	\N	\N	2024-08-03 15:56:18.98434+00	1
c0514564-6187-481f-bf0c-fd54fec908ec	304423f7301e2301a93fd6e0bdfe5ccb4012db2e43d6979747a859707fd111b5	2024-08-03 15:56:21.491798+00	20230813090626_added_activity_model	\N	\N	2024-08-03 15:56:20.430824+00	1
509752ef-d5bb-40e8-9a78-5697eadb8ec6	fa00d24e7d24b372945563ffa5e3098048e71c4a5873e11006797bd6f8ea1ba8	2024-08-22 18:45:48.517295+00	20240822184546_update_qr_code_relationship	\N	\N	2024-08-22 18:45:47.450699+00	1
86e68fe8-372d-4bd2-8497-ad53ec78086e	a0c6641846296deffc3eb7a32ef34a464a2691a54fcbc7f1aa78213723074f04	2024-08-03 15:56:27.451183+00	20230821021023_	\N	\N	2024-08-03 15:56:26.36712+00	1
62630309-527b-4064-802c-ca6b4e23ec4a	88783b913e421e40a6bbcc78d69677bbba5b4b8bc499c87a93ec9a9728761896	2024-08-03 15:56:28.87043+00	20230903052659_	\N	\N	2024-08-03 15:56:27.857455+00	1
0bdfa147-4bb9-406f-8c8e-192546e73707	6789d25351d177f89e3e901e3b799bffd357ba7127af1d0251388b89a5b09b89	2024-10-12 19:41:50.845035+00	20241012194148_add_admin	\N	\N	2024-10-12 19:41:49.877999+00	1
ba2d4d3d-dc05-4af2-891d-ddf00fc6d792	708f58fa8e5ea3423fc1122a60dd43efedb05d63738cc114bccb669274b9b2de	2024-08-03 15:56:30.286069+00	20230905032751_	\N	\N	2024-08-03 15:56:29.278564+00	1
49e7af4b-d50b-4a48-97d8-45938b2cdcb1	b053a252b5da58e6582624e4e704c158379b7fdf7434ad63f1d1b2ffa7841ba2	2024-09-30 18:46:20.780803+00	20240930184618_add_name_relation_to_post	\N	\N	2024-09-30 18:46:19.241502+00	1
7981b027-7c76-4dc4-9dda-2c800d5d9ded	f31a4476551add63991b43b9bb946d738709e384594ed41d4177607971569016	2024-09-06 16:24:39.252323+00	20240906162437_add_activation_code_to_qrcode	\N	\N	2024-09-06 16:24:38.26161+00	1
d0babc90-dd7f-43a0-8f88-76d7a8dda898	57cc3c22182156c128ec935b464a7e86d750e1bf248994253a5e5a230cb645e6	2024-09-15 10:46:11.7563+00	20240915104609_add_cover_photo_position_y	\N	\N	2024-09-15 10:46:10.747972+00	1
4936e544-0f0c-42b2-a65e-50bddc9fedce	158c827c3ce30d5c9318a41dbefd82ddc460adcbeaa9c0139526634407cfd461	2024-09-30 18:49:04.595544+00	20240930184901_add_pending	\N	\N	2024-09-30 18:49:02.671815+00	1
94a3860a-632b-4136-a6aa-5a386b7ee5a4	320ff7af8c6705a60183db03759c69080bc91a0d55a270c08e0bc2e88ea91dba	2024-11-23 12:13:16.787533+00	20241123121314_updateeeeee	\N	\N	2024-11-23 12:13:15.788332+00	1
6b19d755-d806-484a-8573-20e14cb587f3	4ca9060867d615fbceb4af263a4e08ccd096486104e7f736e9ff29b3e3f0ad79	2024-11-23 11:50:19.201284+00	20241123115016_edit_form_update	\N	\N	2024-11-23 11:50:18.283674+00	1
0afe9be9-06c0-4ef2-a46c-490f810f9593	9cbe8a16ad86a9c840095e7a1386cca6214a5a6e0373f988fd46a7f12c72d2f4	2024-11-24 16:53:08.756688+00	20241124165305_date_of_passing_added	\N	\N	2024-11-24 16:53:07.334808+00	1
97885041-2c15-4e80-8a9b-94a40544bd33	942f6fb0c2847914008d446673b70a3d808fd22eaee1820df661371f0d4340fa	2024-12-30 18:01:21.999731+00	20241230180119_social_media_links	\N	\N	2024-12-30 18:01:20.974377+00	1
\.


--
-- Name: Activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: db_owner
--

SELECT pg_catalog.setval('public."Activity_id_seq"', 34, true);


--
-- Name: CommentLike_id_seq; Type: SEQUENCE SET; Schema: public; Owner: db_owner
--

SELECT pg_catalog.setval('public."CommentLike_id_seq"', 2, true);


--
-- Name: Comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: db_owner
--

SELECT pg_catalog.setval('public."Comment_id_seq"', 12, true);


--
-- Name: Follow_id_seq; Type: SEQUENCE SET; Schema: public; Owner: db_owner
--

SELECT pg_catalog.setval('public."Follow_id_seq"', 7, true);


--
-- Name: PostLike_id_seq; Type: SEQUENCE SET; Schema: public; Owner: db_owner
--

SELECT pg_catalog.setval('public."PostLike_id_seq"', 13, true);


--
-- Name: Post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: db_owner
--

SELECT pg_catalog.setval('public."Post_id_seq"', 73, true);


--
-- Name: VisualMedia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: db_owner
--

SELECT pg_catalog.setval('public."VisualMedia_id_seq"', 59, true);


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: Activity Activity_pkey; Type: CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_pkey" PRIMARY KEY (id);


--
-- Name: CommentLike CommentLike_pkey; Type: CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."CommentLike"
    ADD CONSTRAINT "CommentLike_pkey" PRIMARY KEY (id);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: Follow Follow_pkey; Type: CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."Follow"
    ADD CONSTRAINT "Follow_pkey" PRIMARY KEY (id);


--
-- Name: PostLike PostLike_pkey; Type: CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."PostLike"
    ADD CONSTRAINT "PostLike_pkey" PRIMARY KEY (id);


--
-- Name: Post Post_pkey; Type: CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_pkey" PRIMARY KEY (id);


--
-- Name: QRCode QRCode_pkey; Type: CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."QRCode"
    ADD CONSTRAINT "QRCode_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: VisualMedia VisualMedia_pkey; Type: CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."VisualMedia"
    ADD CONSTRAINT "VisualMedia_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: db_owner
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");


--
-- Name: CommentLike_userId_commentId_key; Type: INDEX; Schema: public; Owner: db_owner
--

CREATE UNIQUE INDEX "CommentLike_userId_commentId_key" ON public."CommentLike" USING btree ("userId", "commentId");


--
-- Name: Comment_parentId_idx; Type: INDEX; Schema: public; Owner: db_owner
--

CREATE INDEX "Comment_parentId_idx" ON public."Comment" USING btree ("parentId");


--
-- Name: Comment_postId_idx; Type: INDEX; Schema: public; Owner: db_owner
--

CREATE INDEX "Comment_postId_idx" ON public."Comment" USING btree ("postId");


--
-- Name: Comment_userId_idx; Type: INDEX; Schema: public; Owner: db_owner
--

CREATE INDEX "Comment_userId_idx" ON public."Comment" USING btree ("userId");


--
-- Name: Follow_followerId_followingId_key; Type: INDEX; Schema: public; Owner: db_owner
--

CREATE UNIQUE INDEX "Follow_followerId_followingId_key" ON public."Follow" USING btree ("followerId", "followingId");


--
-- Name: PostLike_userId_postId_key; Type: INDEX; Schema: public; Owner: db_owner
--

CREATE UNIQUE INDEX "PostLike_userId_postId_key" ON public."PostLike" USING btree ("userId", "postId");


--
-- Name: QRCode_code_key; Type: INDEX; Schema: public; Owner: db_owner
--

CREATE UNIQUE INDEX "QRCode_code_key" ON public."QRCode" USING btree (code);


--
-- Name: QRCode_userId_key; Type: INDEX; Schema: public; Owner: db_owner
--

CREATE UNIQUE INDEX "QRCode_userId_key" ON public."QRCode" USING btree ("userId");


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: db_owner
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: db_owner
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_qrCodeId_key; Type: INDEX; Schema: public; Owner: db_owner
--

CREATE UNIQUE INDEX "User_qrCodeId_key" ON public."User" USING btree ("qrCodeId");


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: db_owner
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: VerificationToken_identifier_token_key; Type: INDEX; Schema: public; Owner: db_owner
--

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);


--
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: db_owner
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Activity Activity_sourceUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_sourceUserId_fkey" FOREIGN KEY ("sourceUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Activity Activity_targetUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CommentLike CommentLike_commentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."CommentLike"
    ADD CONSTRAINT "CommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES public."Comment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CommentLike CommentLike_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."CommentLike"
    ADD CONSTRAINT "CommentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comment Comment_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Comment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comment Comment_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comment Comment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Follow Follow_followerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."Follow"
    ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Follow Follow_followingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."Follow"
    ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PostLike PostLike_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."PostLike"
    ADD CONSTRAINT "PostLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PostLike PostLike_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."PostLike"
    ADD CONSTRAINT "PostLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Post Post_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QRCode QRCode_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."QRCode"
    ADD CONSTRAINT "QRCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: VisualMedia VisualMedia_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."VisualMedia"
    ADD CONSTRAINT "VisualMedia_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: VisualMedia VisualMedia_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_owner
--

ALTER TABLE ONLY public."VisualMedia"
    ADD CONSTRAINT "VisualMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

