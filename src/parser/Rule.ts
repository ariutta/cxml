// This file is part of cxml, copyright (c) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import {Namespace} from '../xml/Namespace';
import {MemberRef} from '../xml/MemberRef';

/** Interface implemented by schema type classes, allowing custom hooks. */

export interface HandlerInstance {
	[key: string]: any;

	content?: any;
	_exists: boolean;
	_namespace: string;
	_parent?: HandlerInstance;
	_name?: string;

	_before?(): void;
	_after?(): void;
}

/** Base class inherited by all schema type classes, not defining custom hooks. */

export class Member implements HandlerInstance {
	/** Name of the type, pointing to the name of the constructor function.
	  * Might contain garbage... */
	// static name: string;
	// static type: Type;
	_exists: boolean;
	_namespace: string;
}

/** Class type compatible with schema type classes. */

export interface RuleClass {
	new(): Member;

	rule?: Rule;
}

/** Class type compatible with schema type classes, allowing custom hooks. */

export interface HandlerClass extends RuleClass {
	new(): HandlerInstance;

	_custom?: boolean;
}

/** Parser rule, defines a handler class, valid attributes and children
  * for an XSD tag. */

export class Rule {
	constructor(handler: RuleClass) {
		this.handler = handler;
	}

	addAttribute(ref: MemberRef, namespace: Namespace) {
		this.attributeTbl[namespace.getPrefix() + ref.member.name] = ref;
	}

	addChild(ref: MemberRef) {
		this.childTbl[ref.member.namespace.getPrefix() + ref.member.name] = ref;
	}

	namespace: Namespace;

	/** Constructor function for creating objects handling and representing the results of this parsing rule. */
	handler: HandlerClass;

	/** Table of allowed attributes. */
	attributeTbl: { [key: string]: MemberRef } = {};

	/** Table mapping the names of allowed child tags, to their parsing rules. */
	childTbl: { [key: string]: MemberRef };

	/** Type has text content representable as JavaScript primitives. */
	isPrimitive: boolean;
	/** Primitive type is inherited without any additional attributes
	  * or children, so is can be represented as a JavaScript primitive. */
	isPlainPrimitive: boolean;
	/** Text content is a whitespace-separated list of primitive types. */
	isList: boolean;

	/** JavaScript primitive type that can represent the text content. */
	primitiveType: string;
}
